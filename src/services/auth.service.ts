import User from "../models/user.model";
import { BcryptUtils, TokenUtils } from "../lib/shared";
import SessionService from "./session.service";
import { ISession } from "../models/session.model";
import { SignOptions } from "jsonwebtoken";

class AuthService {
  private readonly userModelRepository: typeof User;
  private readonly bcryptUtils: BcryptUtils;
  private readonly tokenUtils: TokenUtils;
  private readonly sessionService: SessionService;
  private readonly accessTokenExpires: string =
    process.env.ACCESS_TOKEN_EXPIRES ?? "10m";
  private readonly refreshTokenExpires: string =
    process.env.REFRESH_TOKEN_EXPIRES ?? "7d";

  constructor(userModelRepository: typeof User = User) {
    this.userModelRepository = userModelRepository;
    this.bcryptUtils = new BcryptUtils();
    this.tokenUtils = new TokenUtils();
    this.sessionService = new SessionService();
  }

  /**
   * Generate a unique deviceId (based on IP address and User-Agent)
   * Use a combination of IP address, User-Agent, and Timestamp to generate a unique device ID
   * Ensure uniqueness with timestamp
   * Optionally hash the device ID to hide raw data
   */

  private generateDeviceId = (ipAddress: string, userAgent: string) => {
    const timestamp = new Date().getTime();
    const rawDeviceId = `${ipAddress}-${userAgent}-${timestamp}`;
    return rawDeviceId;
  };

  /**
   * user login service
   * @param userIfo @object -{email:string, password:string}
   * @return promise<{any}>
   */
  // region login serivce
  public loginUser = async (userInfo: {
    email: string;
    password: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<any> => {
    try {
      const user = await this.userModelRepository.findOne({
        email: userInfo.email,
      });
      if (!user) return { success: false, message: "Invalid Credentials!" };

      const isPasswordMatch = await this.bcryptUtils.comparePassword(
        userInfo.password,
        user.password
      );
      if (!isPasswordMatch)
        return { success: false, message: "Invalid Credentials!" };

      // generate token (access and refresh)
      const accessToken = this.tokenUtils.generateToken(
        { id: user._id, email: user.email },
        this.accessTokenExpires as SignOptions["expiresIn"]
      );
      const refreshToken = this.tokenUtils.generateToken(
        { id: user._id, email: user.email },
        this.refreshTokenExpires as SignOptions["expiresIn"]
      );

      // update
      user.refreshToken = refreshToken;
      await user.save();

      // update and create Session for the devive tracking features

      const deviceId = this.generateDeviceId(
        userInfo.ipAddress,
        userInfo.userAgent
      );
      await this.sessionService.updateOrCreateSession({
        userId: user._id,
        deviceId,
        ipAddress: userInfo.ipAddress,
        userAgent: userInfo.userAgent,
        refreshToken,
      } as ISession);

      return {
        success: true,
        message: "Login Successfull",
        data: {
          user: {
            id: user._id,
            email: user.email,
          },
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error(`Error to login user: ${error}`);
      throw error;
    }
  };

  /**
   * User registration service
   * @param userInfo
   */

  // region registration service

  public register = async (userInfo: any): Promise<any> => {
    try {
      const UserExists = await this.userModelRepository.findOne({
        email: userInfo.email,
      });
      if (UserExists)
        return {
          success: false,
          message: "User already exists!",
        };

      // hashing the password
      userInfo.password = await this.bcryptUtils.hashPassword(
        userInfo.password
      );

      // save the user data
      const createdUser = await this.userModelRepository.create(userInfo);
      await createdUser.save();

      return {
        success: true,
        message: "User Registration successfully",
        user: createdUser,
      };
    } catch (error) {
      console.error(`Error creating the user ${error}`);
      throw error;
    }
  };

  /**
   * User logout
   * own logout service
   */

  // region user logout
  public logout = async (refreshToken: string): Promise<any> => {
    try {
      return await this.sessionService.logoutByRefreshToken(refreshToken);
    } catch (error) {
      console.error(`Error occured while do logout: ${error}`);
      throw error;
    }
  };

  /**
   * REFRESH ACCESS TOKEN
   * Renew access token service
   * @param refreshToken
   */
  public async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const session = await this.sessionService.findByRefreshToken(
        refreshToken
      );
      if (!session)
        return {
          success: false,
          message: "Invalid refresh token",
        };

      const user = await this.userModelRepository.findById(session.userId);
      if (!user)
        return {
          success: false,
          message: "User not found",
        };

      // Generate new access token
      // For Development Purpose 30m is the time limit
      const accessToken = this.tokenUtils.generateToken(
        { id: user._id, email: user.email },
        "30m"
      );

      return {
        success: true,
        message: "Access token refreshed",
        data: {
          accessToken,
        },
      };
    } catch (error) {
      console.error(`Error occured while refresh access token: ${error}`);
      throw error;
    }
  }
}

export default AuthService;
