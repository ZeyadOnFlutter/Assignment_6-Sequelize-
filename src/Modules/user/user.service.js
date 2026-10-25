import { where } from 'sequelize';
import { roleEnum } from '../../Common/Enums/user.enum.js';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
import { UserModel } from '../../DB/models/user.model.js';

// export const getUsersWithPagination = async (req, res) => {
//   try {
//     const { page, limit } = req.query;
//     if (page === undefined || limit === undefined) {
//       const users = await UserModel.findAll({
//         include: {
//           model: UserModel,
//           through: {
//             attributes: [],
//           },
//         },
//       });
//       return successResponse(res, 200, 'Success', users);
//     }
//     page = parseInt(page);
//     limit = parseInt(limit);
//     const offset = (page - 1) * limit;
//     if (page && page < 0) {
//       throw new Error('Page must be positive number', { cause: { status: 400 } });
//     }
//     if (limit && limit < 0) {
//       throw new Error('limit must be positive number', { cause: { status: 400 } });
//     }
//     const { count, rows: allusers } = await UserModel.findAndCountAll({
//       limit,
//       offset,
//       include: {
//         model: UserModel,
//         through: {
//           attributes: [],
//         },
//       },
//     });
//     const successData = {
//       totalCount: count,
//       currentPage: page,
//       limit,
//       totalPages: Math.ceil(count / limit),
//       allusers,
//     };
//     return successResponse(res, 200, 'Success', successData);
//   } catch (error) {
//     throw new Error('Error Getting Users', { cause: { status: 500, errors: error } });
//   }
// };
// export const getUsersWithPaginationWithErrorsList = async (query) => {
//   const { page, limit } = query;
//   let errors = [];
//   if (page === undefined || limit === undefined) {
//     const users = await UserModel.findAll({
//       include: {
//         model: UserModel,
//         through: {
//           attributes: [],
//         },
//       },
//     });
//     return users;
//   }
//   page = parseInt(page);
//   limit = parseInt(limit);
//   const offset = (page - 1) * limit;
//   if (page && page < 0) {
//     errors.push('Page must be positive number');
//   }
//   if (limit && limit < 0) {
//     errors.push('limit must be positive number');
//   }
//   const { count, rows: allusers } = await UserModel.findAndCountAll({
//     limit,
//     offset,
//     include: {
//       model: UserModel,
//       through: {
//         attributes: [],
//       },
//     },
//   });
//   if (errors.length > 0) throw new Error('Error in pagination', { cause: { status: 400, errors } });
//   const successData = {
//     totalCount: count,
//     currentPage: page,
//     limit,
//     totalPages: Math.ceil(count / limit),
//     allusers,
//   };
//   return successData;
// };

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, confirmpassword } = req.body;
    if (!name || !email || !password || !role) {
      throw new Error('Please provide all required fields', { cause: { status: 400 } });
    }
    if (password !== confirmpassword) {
      throw new Error('Passwords do not match', { cause: { status: 400 } });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email', {
        cause: { status: 400 },
      });
    }
    if (!Object.values(roleEnum).includes(role)) {
      throw new Error(`Role must be either ${Object.values(roleEnum).join(', ')}`, {
        cause: { status: 400 },
      });
    }
    const existedUser = await UserModel.findOne({ where: email });
    if (existedUser) throw new Error('Email Already Exists', { cause: { status: 409 } });
    const user = UserModel.build({
      name,
      email,
      password,
      role,
    });
    await user.save();

    return successResponse(res, 201, 'User Created Successfully', user);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Sign Up Issue', { cause: { status: 500, errors: [error] } });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { id } = req.params;

    if (!id || id <= 0 || isNaN(parseInt(id))) {
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    }
    if (!name || !email || !password || !role) {
      throw new Error('Please provide all required fields', { cause: { status: 400 } });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email', {
        cause: { status: 400 },
      });
    }
    if (!Object.values(roleEnum).includes(role)) {
      throw new Error('Role must be either user or admin', { cause: { status: 400 } });
    }
    const [updatedUser, created] = await UserModel.upsert(
      { id, name, email, password, role },
      { validate: false }
    );
    const message = created ? 'User Created Successfully' : 'User Updated Successfully';
    return successResponse(res, created ? 201 : 200, message, updatedUser);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('User Update/Create Issue', { cause: { status: 500, errors: [error] } });
  }
};

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new Error('Please provide The Email', { cause: { status: 400 } });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Please provide a valid email', {
        cause: { status: 400 },
      });
    }
    const user = await UserModel.findOne({
      attributes: { exclude: ['password'] },
      where: { email },
    });
    if (!user) throw new Error('User Not Found', { cause: { status: 404 } });
    return successResponse(res, 200, 'User Found Successfully', user);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('User Update/Create Issue', { cause: { status: 500, errors: [error] } });
  }
};
export const findUserByPk = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id <= 0 || isNaN(parseInt(id))) {
      throw new Error('Please provide user id above 0 and a number', { cause: { status: 400 } });
    }
    const user = await UserModel.findByPk(id, { attributes: { exclude: ['role'] } });
    if (!user) throw new Error('User Not Found', { cause: { status: 404 } });
    return successResponse(res, 200, 'User Found Successfully', user);
  } catch (error) {
    throw error.cause
      ? error
      : new Error('Issue Getting User', { cause: { status: 500, errors: [error] } });
  }
};
