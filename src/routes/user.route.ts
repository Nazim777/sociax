import { Router } from "express";
import { UserController } from "../controller";
import { ImageUpload } from "../middleware";

const router = Router();
const userController = new UserController();

/**
 * Get all users
 * Update theme mode
 */
router
  .route("/")
  .get(userController.showUsers)
  .patch(userController.updateThemeMode);
/**
 * Get auth user
 */
router.route("/me").get(userController.profileAuth);
/**
 * Get User Profile by Id
 */
router.route("/:userId").get(userController.findUserById);
/**
 * Upload profile picture
 */
router
  .route("/update-profile-picture")
  .patch(ImageUpload.single("file"), userController.uploadProfilePicture);
/**
 * Upload cover picture
 */
router
  .route("/update-cover-picture")
  .patch(ImageUpload.single("file"), userController.uploadCoverPicture);


export default router;