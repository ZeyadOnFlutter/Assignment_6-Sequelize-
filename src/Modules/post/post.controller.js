import { Router } from 'express';
import * as postSerivce from './post.service.js';
import { successResponse } from '../../Common/Utils/Response/success.response.js';
const router = Router();
router.post('/create', postSerivce.createPost);
router.delete('/delete{/:id}', postSerivce.deletePost);
router.get('/details', postSerivce.getAllPosts);
router.get('/commentcount', postSerivce.getAllPostsCommentCount);
export default router;
