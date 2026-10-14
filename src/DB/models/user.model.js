import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        notNull: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        checkPasswordLength: (value) => {
          if (value.length < 6) {
            throw new Error('Password must be at least 6 characters long');
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'Role must be either user or admin',
        },
        notEmpty: true,
        notNull: true,
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    hooks: {
      beforeCreate: (user) => {
        const checkNameLength = (name) => {
          if (name.length <= 2) {
            throw new Error('Name must be at least 2 characters long', { cause: { status: 400 } });
          }
        };
        checkNameLength(user.name);
      },
    },
  }
);
