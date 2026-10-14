import { connectToDB, syncDB } from './DB/connection.js';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { UserModel } from './DB/models/user.model.js';
import { PostModel } from './DB/models/post.model.js';
import { CommentModel } from './DB/models/comment.model.js';
import { commentRouter, postRouter, userRouter } from './Modules/index.js';
export const bootstrap = async (app, express, PORT) => {
  app.use(express.json());
  await connectToDB(app, PORT);
  await syncDB();

  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/comments', commentRouter);

  app.all('/*dummy', async (req, res) => {
    return res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  });

  app.use(globalErrorHandler);
};
