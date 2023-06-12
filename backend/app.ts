import express, { Request, Response, NextFunction } from "express";
import { Request as ExpressRequest } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from "./db/userModel";
import dbConnect from "./db/dbConnect";
import auth from "./auth";
import { Contact, ContactRequest } from './db/contactModel';

const app = express();
const router = express.Router();

// Connecting to the data base
dbConnect()

interface RequestCustom extends ExpressRequest {
  user?: {
    userId: string;
  };
}

// Curb Cores Error by adding a header here
app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request: Request, response: Response, next: NextFunction) => {
  response.json({ message: "Server connected!" });
  next();
});

// Register new user
app.post("/register", (request: Request, response: Response) => {
  bcrypt.hash(request.body.password, 10)
  .then((hashedPassword) => {
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
      fullname: "",
    })
    user.save()
    .then((result) => {
      response.status(201).send({
        message:"User registered successfully!",
        result
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error creating user!",
        error
      })
    })
  })
  .catch((error) => {
    response.status(500).send({
      message: "Password was not hashed successfully",
      error
    })
  })
})

// Login to an existing account
app.post("/login", (request: Request, response: Response) => {
  User.findOne({ email:request.body.email })
  .then((user) => {
    if(!user) {
      return response.status(404).send({
        message: "Email not found"
      })
    }

    bcrypt.compare(request.body.password, user.password)
    .then((passwordCheck) => {
      if(!passwordCheck) {
        return response.status(400).send({
          message:"Wrong password",
        })
      }

      // If password is correct, create a json web token and return a success
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      )

      // Setting the token to a HTTP only cookie

      response.cookie("LOGIN-TOKEN", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });

      response.cookie("USER-ID", user._id, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });

      response.status(200).send({
        message: "Login successful!" + token,
        email: user.email,
        userID: user._id,
        token
      })
    })
    .catch((error) => {
      response.status(400).send({
        message: "Wrong password",
        error
      })
    })
  })
  .catch((error) => {
    response.status(404).send({
      message: "Email not found",
      error
    });
  })
})

// Fetch data based on user ID
app.get("/data/:userId", (request: Request, response: Response) => {
  const { userId } = request.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "User not found"
        });
      }

      response.status(200).send(user);
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error fetching user data",
        error
      });
    });
});

// Update user's fullname and username
app.post("/postname/:userId", (request: Request, response: Response) => {
  const { userId } = request.params;
  const { fullname, username } = request.body;

  // Check if fullname and username are of type string
  if (typeof fullname !== "string" || typeof username !== "string") {
    return response.status(400).send({
      message: "Fullname and username must be strings",
    });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      // Update user object with new values
      user.fullname = fullname;
      user.username = username;

      // Save the updated user object
      user
        .save()
        .then((updatedUser) => {
          response.status(200).send(updatedUser);
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error saving user data",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error fetching user data",
        error,
      });
    });
});

// Send contact request
app.post('/contact-request', authenticateToken, async (req: RequestCustom, res: Response) => {
  const { username } = req.body;

  // Check if recipient exists
  const recipient = await User.findOne({ username }).select('_id');
  if (!recipient) {
    return res.status(404).json({ message: `User '${username}' not found` });
  }

  // Check if requester is trying to send a request to themselves
  const requesterId = req.user?.userId;
  const requester = await User.findById(requesterId).select('username');
  if (requester?.username === username) {
    return res.status(400).json({ message: "You can't send a request to yourself" });
  }

    // Check if recipient is already in the user's contacts
    const checkIfAlreadyInvited = await ContactRequest.findOne({
      requesterId,
      recipientId: recipient._id,
    });

    if (checkIfAlreadyInvited) {
      return res.status(400).json({ message: `A request has already been sent to ${username}` });
    }

  // Create and save the contact request
  const request = new ContactRequest({
    username,
    requesterId: req.user?.userId,
    recipientId: recipient._id,
  });

  await request.save();
  res.status(200).json({ message: `Contact request sent to ${username}` });
});

function authenticateToken(req: RequestCustom, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'RANDOM-TOKEN', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user as { userId: string };
      next();
    });
  } else {
    res.status(401).json({message: "error"});
  }
}

// Get contact requests
app.get('/contact-requests/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const requests = await ContactRequest.find({ recipientId: userId }).populate('requesterId', 'username');

    const requestList = await Promise.all(requests.map(async (request) => {
      const requester = await User.findOne({_id: request.requesterId}).select('username');
      return {
        _id: request._id,
        username: requester?.username
      };
    }));

    res.json(requestList);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
// Accept or decline contact request
app.put('/contact/:requestId', async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { userId, action } = req.body;

  try {
    const request = await ContactRequest.findById(requestId).populate('requesterId', 'username');
    if (!request) throw new Error(`Request with ID ${requestId} not found`);
    if (request.recipientId?.toString() !== userId) throw new Error(`User unauthorized`);

    const contact = new Contact({
      username: request.username,
      userId: request.requesterId?._id,
      contactId: request.recipientId,
    });

    if (action === 'accept') {
      await contact.save();
      await ContactRequest.deleteOne({ _id: requestId });
      res.status(200).json({ message: `Contact added: ${request.username}` });
    } else if (action === 'decline') {
      await ContactRequest.deleteOne({ _id: requestId });
      res.status(200).json({ message: `Invitation from ${request.username} declined` });
    } else {
      throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get contact list
app.get('/contact/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    const contacts = await Contact.find({ $or: [{ userId }, { contactId: userId }] }).populate(
      { path: 'contactId', select: 'username' }
    );
    const contactList = contacts.map((contact) => ({
      _id: contact._id,
      username: contact.username,
      status: 'accepted',
    }));

    const requests = await ContactRequest.find({ recipientId: userId }).populate('requesterId', 'username');
    const requestList = requests.map((request) => ({
      _id: request._id,
      username: request.username,
      status: 'pending',
    }));

    res.json([...contactList, ...requestList]);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});


// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized" });
});

export default app;