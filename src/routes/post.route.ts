import { Router } from "express";
import { ImageUpload } from "../middleware";
import { PostController } from "../controller";

const router = Router();

const postController = new PostController();

/**
 * ---- read posts----
 * ---- create post---
 */

router
  .route("/")
  .get(postController.getAllPosts)
  .post(ImageUpload.single("file"), postController.createPost);

/**
 * ---- read post ----
 * ---- update post ----
 * ---- delete post ----
 */

router
  .route("/:postId")
  .get(postController.readPost)
  .put(ImageUpload.single("file"), postController.updatePost)
  .delete(postController.deletePost);

/**
 * showing specific  user posts
 */

router.get("/:userId/posts", postController.specificUserPosts);

export default router;
