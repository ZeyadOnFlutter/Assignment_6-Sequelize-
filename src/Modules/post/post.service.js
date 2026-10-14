import { UserModel } from '../../DB/models/user.model.js';
import { PostModel } from '../../DB/models/post.model.js';
import { CommentModel } from '../../DB/models/comment.model.js';
import { successResponse } from '../../Common/Utils/index.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) {
      throw new Error('Please provide all required fields', { cause: { status: 400 } });
    }
    if (userId <= 0 || isNaN(parseInt(userId))) {
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error('User Not Found', { cause: { status: 400 } });
    }
    const post = new PostModel({ title, content, userId });
    await post.save();

    return successResponse(res, 201, 'Post Created Successfully', post);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Post Creation Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id || id <= 0 || isNaN(parseInt(id))) {
      throw new Error('Please provide post id above 0 and a number', { cause: { status: 400 } });
    }
    if (!userId || userId <= 0 || isNaN(parseInt(userId))) {
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error('User Not Found', { cause: { status: 400 } });
    }
    const post = await PostModel.findByPk(id);
    if (!post) {
      throw new Error('Post Not Found', { cause: { status: 400 } });
    }
    if (post.userId !== userId) {
      throw new Error('This User Not Allowed To Delete This Post', { cause: { status: 403 } });
    }
    const deletedPost = await post.destroy({ force: true }); // soft delete force equal false or without putting force
    return successResponse(res, 201, 'Post Deleted Successfully', deletedPost);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Post Creation Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.findAll({
      attributes: ['id', 'title'],
      include: [
        { model: UserModel, attributes: ['id', 'name'] },
        { model: CommentModel, attributes: ['id', 'content'] },
      ],
    });
    return successResponse(res, 200, 'Posts Found Successfully', posts);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Issue finding Posts', { cause: { status: 500, errors: [error] } });
  }
};
export const getAllPostsCommentCount = async (req, res) => {
  try {
    const posts = await PostModel.findAll({
      attributes: ['id', 'title'],
      include: [{ model: CommentModel }],
    });
    const data = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        commentCount: post.Comments.length,
      };
    });
    return successResponse(res, 200, 'Posts Found Successfully', data);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Issue finding Posts', { cause: { status: 500, errors: [error] } });
  }
};
