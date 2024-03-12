import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid Credentials");
    }
    const isMatch = await bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid Credentials");
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    })
    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).json("Something went wrong!");
  }
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ userId: req.userId });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  }).status(200).json('User has sign out successfully!')
};
export default {
  login,
  verifyUser,
  logout,
};
