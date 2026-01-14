import { Post } from "../models";
import { BlogStorageUtils } from "../lib/shared";

class PostService {
  private readonly postModelRepository: typeof Post;
  constructor(postModelReposiotry: typeof Post = Post) {
    this.postModelRepository = postModelReposiotry;
  }

  /**
   * upload image fro post service
   * this is for post-service upload and internal function
   * @param file
   * @param dirName
   * @returns
   */

  private async uploadImage<T>(
    file: any,
    dirName: string = "post_upload"
  ): Promise<T> {
    try {
      const upload_secure_url = await BlogStorageUtils.uploadImage(
        file,
        dirName
      );
      return upload_secure_url as T;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload image!");
    }
  }

  /**
   * read post service
   * this is for individual post
   * @param postId
   * @returns
   */

  // region read post
  public async readPost(postId: string): Promise<any> {
    try {
      console.log("post id - ", postId);
      const post = await this.postModelRepository
        .findById(postId)
        .populate(
          "user",
          "firstname lastname profilePhoto title themeMode colorMode title"
        )
        .exec();
      if (!post) throw new Error("Post not found");
      return post;
    } catch (error) {
      console.log("Error fetching post", error);
      throw error;
    }
  }

  /**
   * create post service
   * this is for creating the new post
   * @param post
   * @returns
   */

  public async createPost(post: any): Promise<any> {
    try {
      if (post.image) {
        const uploadedImageUrl = await this.uploadImage<string>(post.image);
        post.image = uploadedImageUrl;
      } else {
        delete post.image;
      }

      const newPost = await this.postModelRepository.create(post);
      return await newPost.save();
    } catch (error) {
      console.log("Error creating post", error);
      throw new Error("Failed to create post");
    }
  }

  /**
   * update post service
   * this is for updating a post
   * @param postId
   * @param updatedPost
   */

  // region update post
  public async updatePost(postId: string, postData: any): Promise<any> {
    try {
      if (postData.image) {
        const uploadedImageUrl = await this.uploadImage<string>(postData.image);
        postData.image = uploadedImageUrl;
      } else {
        delete postData.image;
      }

      const updatedPost = await this.postModelRepository.findByIdAndUpdate(
        postId,
        postData,
        { new: true }
      );
      if (!updatedPost) throw new Error("Post not found!");
      return updatedPost;
    } catch (error) {
      console.log("Error updating post", error);
      throw error;
    }
  }

  /**
   * delete post service
   * this is for deleting post
   * @param postId
   */
  // region delete post
  public async deletePost(postId: string): Promise<any> {
    try {
      const deletedPost = await this.postModelRepository.findByIdAndDelete(
        postId
      );
      if (!deletedPost) throw new Error("No post found!");
      return deletedPost;
    } catch (error) {
      console.log("Error deleting post", error);
      throw error;
    }
  }

  /**
   * fetch all post service
   * this is the optimized way to fetch  all posts
   * we used aggerate which is better for large set of data fetching
   * usefull for pagination , searching, filtering, and sorting and relationships
   * @param page
   * @param limit
   */
  // region get all posts
  public async getAllPosts(
    page: number = 1,
    limit: number = 5,
    userId?: string
  ) {
    try {
      const skip = (page - 1) * limit;
      const [result] = await this.postModelRepository.aggregate([
        {
          $match: {
            ownerId: { $ne: null },
          },
        },
        {
          $addFields: { ownerId: { $toObjectId: "$ownerId" } },
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],

            posts: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },

              // 🔹 populate owner
              {
                $lookup: {
                  from: "users",
                  localField: "ownerId",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        firstname: 1,
                        lastname: 1,
                        email: 1,
                        title: 1,
                        profilePhoto: 1,
                      },
                    },
                  ],
                  as: "owner",
                },
              },
              {
                $unwind: {
                  path: "$owner",
                  preserveNullAndEmptyArrays: true,
                },
              },

              // 🔥 ADD THIS BLOCK
              {
                $lookup: {
                  from: "likes", // your likes collection
                  let: { postId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$postId", "$$postId"] },
                            { $eq: ["$userId", { $toObjectId: userId }] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "userLike",
                },
              },
              {
                $addFields: {
                  likedByCurrentUser: {
                    $gt: [{ $size: "$userLike" }, 0],
                  },
                },
              },
              {
                $project: {
                  userLike: 0,
                },
              },
            ],
          },
        },
      ]);

      // calculate pagination metadata
      const total = result.metadata[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return {
        posts: result.posts,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
      };
    } catch (error) {
      console.error("Failed to fetch all posts:", error);
      throw new Error("Failed to fetch all posts");
    }
  }

  /**
   * READ SPECIFIC USER POSTS SERVICE
   * This is for reading all posts of a specific user
   * @param userId
   */
  // region Specific User Posts
  public async specificUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const [result] = await this.postModelRepository.aggregate([
        {
          $match: {
            ownerId: { $eq: userId }, // Filter by userId
          },
        },
        {
          $addFields: { ownerId: { $toObjectId: "$ownerId" } }, // Convert ownerId to ObjectId
        },
        {
          $facet: {
            metadata: [
              // facet for grouping multiple pipelines
              { $count: "total" }, // Count total documents
            ],
            posts: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  // Populate/Join user model
                  from: "users",
                  localField: "ownerId",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        // Select fields from user
                        firstname: 1,
                        lastname: 1,
                        email: 1,
                        title: 1,
                        profilePhoto: 1,
                      },
                    },
                  ],
                  as: "owner",
                },
              },
              {
                $unwind: {
                  // Unwind owner array
                  path: "$owner",
                  preserveNullAndEmptyArrays: true, // Prevents filtering out posts without an owner
                },
              },
            ],
          },
        },
      ]);

      // Calculate pagination metadata
      const total = result.metadata[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        posts: result.posts,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
      };
    } catch (error) {
      console.error("Failed to read specific user posts:", error);
      throw new Error("Failed to read specific user posts");
    }
  }
}

export default PostService;
