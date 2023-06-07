import express, { Request, Response, NextFunction, Router } from "express";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import formidable from 'formidable';
import User from "./db/userModel";
import dbConnect from "./db/dbConnect";
import auth from "./auth";
import path from 'path';
const app = express();
const router = express.Router();

interface FileInfo extends formidable.File {
  name: string,
  path: string,
}

// Connecting to the data base
dbConnect()

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

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized" });
});

export default app;