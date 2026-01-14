import Session from "../models/session.model";
import { ISession } from "../models/session.model";

class SessionService {
  private readonly sessionModelRepository: typeof Session;

  constructor(sessionModelRepository: typeof Session = Session) {
    this.sessionModelRepository = sessionModelRepository;
  }

  /**
   * @param sessionInfo
   * @returns
   */

  // region update/create session
  public updateOrCreateSession = async (
    sessionInfo: ISession
  ): Promise<any> => {
    try {
      await this.sessionModelRepository.findOneAndUpdate(
        {
          userId: sessionInfo.userId,
          deviceId: sessionInfo.deviceId,
        },
        {
          refreshToken: sessionInfo.refreshToken,
          ipAddress: sessionInfo.ipAddress,
          userAgent: sessionInfo.userAgent,
          lastActiveDate: new Date(),
        },
        { new: true, upsert: true }
      );
      return {
        success: true,
        message: "Session created/updated successfully!",
      };
    } catch (error) {
      console.error(`Error to create/update sessions:${error}`);
      throw error;
    }
  };

  /**
   * LOGOUT SESSION BY REFRESH TOKEN
   * This will be using when user will make logout from the device
   * Own system logout feature
   * @param refreshToken
   * @returns
   */
  // region Logout by Refresh Token
  public async logoutByRefreshToken(refreshToken: string): Promise<any> {
    try {
      const result = await this.sessionModelRepository.deleteOne({
        refreshToken,
      });
      if (result.deletedCount === 0) {
        return { success: false, message: "Session not found!" };
      }

      return { success: true, message: "Session deleted successfully!" };
    } catch (error) {
      console.error(`Error to delete session: ${error}`);
      throw error;
    }
  }
  /**
   * get active session service
   * @param userId
   * @returns
   */

  // region get active sessions
  public getActiveSessions = async (userId: string): Promise<any> => {
    try {
      const sessions = await this.sessionModelRepository.find({ userId });
      return { success: true, sessions };
    } catch (error) {
      console.error(`Error to get sessions: ${error}`);
      throw error;
    }
  };

  /**
   * LOGOUT FROM DEVICE SERVICE
   * This will be using when user will make logout other device
   * It will logout the specific device session
   * @param userId
   * @param deviceId
   * @returns
   */
  // region Logout From Device
  public async logoutFromDevice(
    userId: string,
    deviceId: string
  ): Promise<any> {
    try {
      await this.sessionModelRepository.deleteOne({ userId, deviceId });
      return {
        success: true,
        message: "Successfully loggedout from the device!",
      };
    } catch (error) {
      console.error(`Error to logout from device: ${error}`);
      throw error;
    }
  }

  /**
   * LOGOUT FROM ALL DEVICES
   * It will logout all other devices from device
   * @param userId
   * @returns
   */
  // region Logout From All Device
  public async logoutFromAllDevice(userId: string): Promise<any> {
    try {
      await this.sessionModelRepository.deleteMany({ userId });
      return {
        success: true,
        message: "Successfully loggedout from all device!",
      };
    } catch (error) {
      console.error(`Error to logout from all device: ${error}`);
      throw error;
    }
  }

  /**
   * GET SESSION BY REFRESH TOKEN
   * It will get the session by refresh token
   * @param refreshToken
   * @returns
   */
  public async findByRefreshToken(refreshToken: string): Promise<any> {
    try {
      const session = await this.sessionModelRepository.findOne({
        refreshToken,
      });
      return session;
    } catch (error) {
      console.error(`Error to find session by refresh token: ${error}`);
      throw error;
    }
  }
}

export default SessionService;
