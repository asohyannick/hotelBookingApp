import express, { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({messsage: errors.array()})
  } 
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(400).json("User already exist");
    }
    user = new User(req.body);
    await user.save();
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        maxAge: 86400000,
    });
    return res.status(200).json('User has been created successfully!');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export default {
  signup,
};
