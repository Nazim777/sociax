

// email checker middleware..
// const emailChecker = (req: Request, res: Response | any, next: NextFunction) => {
//     // User.find();
//     const email = req.body.email;

//     if (email.length > 0) {
//         User.find({ email: email }, (err: Error, user: any) => {
//             if (err) return res.send(err);
//             if (!user) return res.json({ success: true });

//             if (user.length > 0) {
//                 if (user[0].email === email) {
//                     return res.json({
//                         success: false,
//                         message: 'Email is already taken!',
//                         user
//                     });
//                 }

//                 if (user[0].email !== email) {
//                     return next();
//                 }
//             }

//             return next();
//         });
//     }

//     if (email.length === 0) {
//         return res.json({
//             success: false,
//             message: 'Email is empty!'
//         });
//     }
// };

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
