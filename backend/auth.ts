import express, { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

async function auth(request: AuthRequest, response: Response, next: NextFunction) {
 try {
  const token = await request.headers.authorization?.split(" ")[1]

  if (!token) {
    return response.status(500).send ({
      message: "Error while creating a token!"
    })
  }

  const decodedToken = await jwt.verify(
    token,
    "RANDOM-TOKEN"
  )

  const user = await decodedToken;
  request.user = user

  next();
 } catch (error) {
  response.status(401).json({
    error: new Error("Invalid request!")
  })
 }
}

export default auth