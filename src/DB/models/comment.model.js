import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model.js';
import { sequelize } from '../connection.js';
import { PostModel } from './post.model.js';

export class CommentModel extends Model {}

CommentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
  },
  {
    modelName: 'Comment',
    sequelize,
    freezeTableName: true,
    timestamps: true,
  }
);
UserModel.hasMany(CommentModel, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

CommentModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PostModel.hasMany(CommentModel, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CommentModel.belongsTo(PostModel, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
