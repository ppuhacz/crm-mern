import express, { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import User from "./db/userModel";
import dbConnect from "./db/dbConnect";
const app = express();

// Connecting to the data base
dbConnect()

console.log(process.env.DB_URL)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request: Request, response: Response, next: NextFunction) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// Register new user
app.post("/register", (request:Request, response:Response) => {
  // Hash password
  bcrypt.hash(request.body.password, 10)
  .then((hashedPassword) => {
    const user = new User({
      email: request.body.email,
      password: hashedPassword
    })
    // Save user
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

export default app;
