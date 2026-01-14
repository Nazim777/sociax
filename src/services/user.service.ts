import { IUser } from "@/lib/type";
import User from "../models/user.model";
import { BlogStorageUtils } from "../lib/shared";

class UserService {
  private readonly userModelRepository: typeof User;

  constructor(userModel_repository: typeof User = User) {
    this.userModelRepository = userModel_repository;
  }

  /**
   * UPDATE USER INFORMATIONS
   * Find user by Id and then update informations
   * @param userId
   * @param userInfo
   * @returns
   */
  // region Update User-Info
  public async updateUserInfo(userId: string, userInfo: any) {
    try {
      const updatedUser = await this.userModelRepository.findByIdAndUpdate(
        userId,
        userInfo,
        { new: true, runValidators: true }
      );
      if (!updatedUser) throw new Error("Error while try to update user info.");
      return updatedUser;
    } catch (error) {
      console.error(`Error occured while update user info: ${error}`);
      throw error;
    }
  }

  /**
   * show all users
   */
  // region show all users
  public async showAllUsers(): Promise<Partial<IUser>[]> {
    try {
      const users = await this.userModelRepository.find({});
      if (users.length === 0) throw new Error("Users not found!");
      const newUsers = users.map((user: any) => ({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        title: user.title,
        profilePhoto: user.profilePhoto,
      }));

      return newUsers;
    } catch (error) {
      console.log("Error showing all users service", error);
      throw new Error("Failed to get all users!");
    }
  }

  /**
   * Update user theme mode
   * @param userId
   * @param themeMode
   */
  // region update user theme mode
  public async updateThemeMode(
    userId: string,
    themeMode: string
  ): Promise<any> {
    try {
      if (!userId) throw new Error("User id is required!");
      if (!themeMode) throw new Error("Theme mode is required!");
      const updatedUser = await this.userModelRepository
        .findByIdAndUpdate(
          { _id: userId },
          { themeMode: themeMode },
          { new: true }
        )
        .select("-password");

      if (!updatedUser) throw new Error("User not found to update!");
      return updatedUser;
    } catch (error) {
      console.log("Error updating user theme mode service", error);
      throw error;
    }
  }

  /**
   * FIND USER BY USER_ID
   * Finds a user by their ID.
   * @param userId
   */
  // region Find User By ID
  public async findUser(userId: string): Promise<any> {
    try {
      const user = await this.userModelRepository
        .findById(userId)
        .select("-password");
      if (!user) throw new Error("Failed to get the user!");
      return user;
    } catch (error) {
      console.error(`Error get user service: ${error}`);
      throw error;
    }
  }

  /**
   * upload profile picture
   * @param userId
   * @param file
   */
  // region profile pic upload

  public uploadProfilePicture = async (
    userId: string,
    file: Express.Multer.File | undefined
  ) => {
    try {
      if (!userId) throw new Error("User id is required!");
      if (!file) throw new Error("No file uploaded!");
      //upload file to claudinary
      const uploaded_secure_url = await BlogStorageUtils.uploadImage(
        file,
        "profile_uploads"
      );
      // update user profile picture
      const updatedUser = await this.userModelRepository
        .findByIdAndUpdate(
          userId,
          { profilePhoto: uploaded_secure_url },
          { new: true }
        )
        .select("-password");
      if (!updatedUser) throw new Error("User not found!");
      return updatedUser;
    } catch (error) {
      console.log("Failed to upload profile picture service", error);
      throw error;
    }
  };

  /**
   * upload profile picture
   * @param userId
   * @param file
   */
  // region cover pic upload
  public uploadCoverPicture = async (
    userId: string,
    file: Express.Multer.File | undefined
  ) => {
    try {
      if (!userId) throw new Error("User id is required!");
      if (!file) throw new Error("No file uploaded!");
      //upload file to claudinary
      const uploaded_secure_url = await BlogStorageUtils.uploadImage(
        file,
        "cover_uploads"
      );
      // update user cover picture
      const updatedUser = await this.userModelRepository
        .findByIdAndUpdate(
          userId,
          { coverPhoto: uploaded_secure_url },
          { new: true }
        )
        .select("-password");
      if (!updatedUser) throw new Error("User not found!");
      return updatedUser;
    } catch (error) {
      console.log("Failed to upload cover picture service", error);
      throw error;
    }
  };

  /**
   * GET FOLLOW SUGGESTED USERS
   * Get follow suggested users
   * @returns
   */
  // region Get Follow Suggested
  public async getFollowSuggestedUsers(): Promise<unknown> {
    try {
      const followSuggestedUsers = await this.userModelRepository
        .find({})
        .select("_id firstname lastname email title profilePhoto");
      return followSuggestedUsers;
    } catch (error) {
      console.error(`Error occured while get follow suggested users: ${error}`);
      throw error;
    }
  }
}

export default UserService;
