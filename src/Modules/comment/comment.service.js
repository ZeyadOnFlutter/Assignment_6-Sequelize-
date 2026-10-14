import { UserModel } from '../../DB/models/user.model.js';
import { PostModel } from '../../DB/models/post.model.js';
import { CommentModel } from '../../DB/models/comment.model.js';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
import { Op } from 'sequelize';
export const createCommentBulk = async (req, res) => {
  try {
    const { comments } = req.body;

    if (!comments || !Array.isArray(comments) || comments.length <= 0) {
      throw new Error('Please provide valid comments to create', { cause: { status: 400 } });
    }
    for (const comment of comments) {
      if (!comment.userId || comment.userId <= 0 || isNaN(parseInt(comment.userId))) {
        throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
      }
      if (!comment.postId || comment.postId <= 0 || isNaN(parseInt(comment.postId))) {
        throw new Error('Please provide post id above 0 and a number', { cause: { status: 400 } });
      }
      if (typeof comment.content !== 'string' || comment.content.trim() === '') {
        throw new Error('Content must be a non-empty string', {
          cause: { status: 400 },
        });
      }
      const user = await UserModel.findByPk(comment.userId);
      if (!user) throw new Error('User Not Found', { cause: { status: 404 } });
      const post = await PostModel.findByPk(comment.postId);
      if (!post) throw new Error('Post Not Found', { cause: { status: 404 } });
    }
    const createdComments = await CommentModel.bulkCreate(comments);
    if (!createdComments) {
      throw new Error('Error Creating Comments', { cause: { status: 404 } });
    }

    return successResponse(res, 200, 'Commnets Created Successfully', createdComments);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Creation Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error.message] },
        });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    if (!id || id <= 0 || isNaN(parseInt(id))) {
      throw new Error('Please provide comment id above 0 and a number', { cause: { status: 400 } });
    }
    if (!userId || userId <= 0 || isNaN(parseInt(userId))) {
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    }
    if (typeof content !== 'string' || content.trim() === '')
      throw new Error('Content must be a non-empty string', {
        cause: { status: 400 },
      });
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error('User Not Found', { cause: { status: 400 } });
    }
    const comment = await CommentModel.findByPk(id);
    if (!comment) {
      throw new Error('Comment Not Found', { cause: { status: 400 } });
    }
    if (comment.userId !== userId) {
      throw new Error('This User Not Allowed To Update This Comment', { cause: { status: 403 } });
    }
    const updatedComment = await comment.update({ content });
    return successResponse(res, 201, 'Comment Updated Successfully', updatedComment);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Update Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const findOrCreateComment = async (req, res) => {
  try {
    const { userId, postId, content } = req.body;
    if (!userId || userId <= 0 || isNaN(parseInt(userId)))
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    if (!postId || postId <= 0 || isNaN(parseInt(postId)))
      throw new Error('Please provide post id above 0 and a number', { cause: { status: 400 } });
    if (typeof content !== 'string' || content.trim() === '')
      throw new Error('Content must be a non-empty string', { cause: { status: 400 } });

    const user = await UserModel.findByPk(userId);
    if (!user) throw new Error('User Not Found', { cause: { status: 404 } });
    const post = await PostModel.findByPk(postId);
    if (!post) throw new Error('Post Not Found', { cause: { status: 404 } });

    const [comment, created] = await CommentModel.findOrCreate({
      where: { userId, postId, content },
    });
    return successResponse(
      res,
      created ? 201 : 200,
      created ? 'Comment Created Successfully' : 'Comment Already Exists',
      comment
    );
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Find Or Create Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const searchComments = async (req, res) => {
  try {
    const { query } = req.query;

    if (typeof query !== 'string' || query.trim() === '')
      throw new Error('Query must be a non-empty string', {
        cause: { status: 400 },
      });

    const { count, rows: comments } = await CommentModel.findAndCountAll({
      where: {
        content: {
          [Op.regexp]: `[[:<:]]${query}[[:>:]]`,
        },
      },
    });
    return successResponse(
      res,
      200,
      comments.length === 0 ? 'no comments found' : 'Comments Fetched Successfully',
      comments.length === 0
        ? undefined
        : {
            count,
            comments,
          }
    );
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Update Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const getNewestComments = async (req, res) => {
  try {
    const comments = await CommentModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: 3,
    });
    return successResponse(res, 200, 'Comments Fetched Successfully', comments);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Update Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
export const getSpecificCommentWithUserAndPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id <= 0 || isNaN(parseInt(id))) {
      throw new Error('Please provide comment id above 0 and a number', { cause: { status: 400 } });
    }
    const comment = await CommentModel.findByPk(id, {
      include: [
        {
          model: UserModel,
        },
        {
          model: PostModel,
        },
      ],
    });
    return successResponse(res, 201, 'Comment Fetched Successfully', comment);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Comment Fetch Failed Due To Server Side Issue', {
          cause: { status: 500, errors: [error] },
        });
  }
};
