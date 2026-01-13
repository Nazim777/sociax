import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const emailChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;

    if (!email || email.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email is empty!",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "Email is already taken!",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default emailChecker;
