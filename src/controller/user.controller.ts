import { NextFunction, Request, Response } from "express";
import { IUser } from "../lib/type";
import { UserService } from "../services";

class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * show all users
   * @param {Request} _req
   * @param {Response} res
   * @param {NextFunction} next
   */

  public showUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.userService.showAllUsers();
      if (!users)
        return res
          .status(400)
          .json({ success: false, message: "No User Found!" });
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log("error showing all user controller", error);
      next(error);
    }
  };

  /**
   * user theme mode update
   * @param {Request} req
   * @param {Response} res
   */

  public updateThemeMode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req as any)?.user?._id;
    console.log('userId',userId)
    const themeMode = req.body.themeMode;
    try {
      const updateduser = await this.userService.updateThemeMode(
        userId,
        themeMode as string
      );
      res.status(200).json({
        isUpdate: true,
        user: updateduser,
      });
    } catch (error: any) {
      console.log("Error updating theme mode controller", error);
      next(error);
    }
  };

  /**
   * find profile by id
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  // region find user by id
  public findUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = String(req.params.userId);
    try {
      const user = await this.userService.findUser(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log("Error getting user by id controller", error);
      next(error);
    }
  };

  /**
   * Profile auth
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */

  public profileAuth = (req: Request, res: Response): void => {
    try {
      const {
        _id,
        email,
        firstname,
        lastname,
        title,
        profilePhoto,
        themeMode,
        colorMode,
        coverPhoto
      } = (req as any).user as IUser;
      res.status(200).json({
        isAuth: true,
        user: {
          _id,
          email,
          firstname,
          lastname,
          title,
          profilePhoto,
          coverPhoto,
          themeMode,
          colorMode,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "User not found!" });
    }
  };

  /**
   * upload profile picture
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */

  public uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req as any).user?._id;
    const file = req.file;
    try {
      const user = await this.userService.uploadProfilePicture(userId, file);
      res
        .status(200)
        .json({
          success: true,
          message: "Profile picture uploaded successfully!",
          user,
        });
    } catch (error) {
      console.log("failed to uplaod profile picture ", error);
      next(error);
    }
  };

  /**
   * upload cover picture
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public uploadCoverPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user?._id;
      const file = req.file;
      const user = await this.userService.uploadCoverPicture(userId, file);
      res
        .status(200)
        .json({
          success: true,
          message: "Cover picture updated successfully!",
          user,
        });
    } catch (error) {
      console.log("failed to uplaod profile picture ", error);
      next(error);
    }
  };
}

export default UserController;