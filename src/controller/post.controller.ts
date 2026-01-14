import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { PostService } from "../services";

class PostController {
  private readonly postService: PostService;
  constructor() {
    this.postService = new PostService();
  }

  /**
   * read post controller
   * @param req
   * @param res
   * @param next
   * @returns
   */

  public readPost = async (
    req: Request | any,
    res: Response | any,
    next: NextFunction
  ) => {
    const postId = req.params.postId;

    // find post by postId
    try {
      const post = await this.postService.readPost(postId);
      if (!post) throw new Error("Post not found!");
      res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      console.error(`Error in readPost controller: ${error}`);
      next(error);
    }
  };

  /**
   * read all post controller
   * @param req
   * @param res
   * @param next
   * @returns
   */
  // region read all post

  public getAllPosts = async (
    req: Request | any,
    res: Response | any,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.max(1, Number(limit));
      const userId = (req as any).user?._id;

      // fetch posts with populated user, filtering out those with non existent user
      const posts = await this.postService.getAllPosts(
        pageNumber,
        limitNumber,
        userId
      );
      if (!posts) res.status(400).json({ sucess: false, posts });

      res.status(200).json({
        success: true,
        ...posts,
      });
    } catch (error) {
      console.log("Error in read all post controller", error);
      next(error);
    }
  };

  /**
   * get specific user post controller
   * * @param req
   * @param res
   * @param next
   * @returns
   */
  // region specifi user post
  public specificUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.userId;
    try {
      const posts = await this.postService.specificUserPosts(userId as string);
      if (!posts) res.status(400).json({ success: false, posts });
      res.status(200).json({
        success: true,
        ...posts,
      });
    } catch (error) {
      console.log("error getting the specific user post controller", error);
      next(error);
    }
  };

  /**
   * * @param req
   * @param res
   * @param next
   * @returns
   */
  // region create post
  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const currentUserId = String((req as any).user._id);
    const post: any = {
      content: req.body.content,
      ownerId: currentUserId,
      user: new Types.ObjectId(currentUserId),
    };
    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..

    if (req.file !== undefined) {
      post.image = req.file;
    }

    try {
      await this.postService.createPost(post);
      res.status(201).json({
        success: true,
        message: "Post Created!",
      });
    } catch (error) {
      console.error(`Error when create post: ${error}`);
      return next(error);
    }
  };

  /**
   * UPDATE POST CONTROLLER
   * @param req
   * @param res
   */
  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.postId;
    const post = { ...req.body };

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file;
    }

    try {
      const docs = await this.postService.updatePost(id as string, post);
      if (!docs) throw new Error("Post Can not Update!");

      res.status(200).json({
        success: true,
        docs,
      });
    } catch (error) {
      console.error(`Error when update post: ${error}`);
      next(error);
    }
  };

  /**
   * DELETE POST CONTROLLER
   * @param req
   * @param res
   */
  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.postId;

    try {
      const docs = await this.postService.deletePost(id as string);
      if (!docs) throw new Error("Post Can not Delete!");

      res.status(200).json({
        success: true,
        message: "Post Deleted Successfully!",
      });
    } catch (error) {
      console.error(`Error when update post: ${error}`);
      next(error);
    }
  };
}

export default PostController;
