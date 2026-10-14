import { Router } from 'express';
import * as userService from './user.service.js';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
const router = Router();

router.post('/signup', userService.signUp);
router.put('/update{/:id}', userService.updateUser);
router.get('/getUserByEmail', userService.findUserByEmail);
router.get('/getUserByPk{/:id}', userService.findUserByPk);
// router.get('/get', async (req, res) => {
//   const result = await userService.getUsersWithPaginationWithErrorsList(req.query);
//   return successResponse(res, 200, 'Success', result);
// });
export default router;
