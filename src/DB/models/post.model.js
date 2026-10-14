import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model.js';
import { sequelize } from '../connection.js';

export class PostModel extends Model {}

PostModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
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
    modelName: 'Post',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);
UserModel.hasMany(PostModel, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
PostModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
