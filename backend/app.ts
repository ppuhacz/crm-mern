import express, { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from "./db/userModel";
import dbConnect from "./db/dbConnect";
import auth from "./auth";
const app = express();

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
      password: hashedPassword
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

      response.status(200).send({
        message: "Login successful!",
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

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

export default app;