import express from 'express' 
import {addComment,editComment,deleteComment,fetchAllComments,fetchOwnComments,fetchWishedComment} from '../controllers/commentController.js'

const commentRouter = express.Router();


commentRouter.post('/add', addComment);
commentRouter.post('/edit', editComment);
commentRouter.post('/delete', deleteComment);
commentRouter.get('/list', fetchAllComments); 
commentRouter.get('/listOwn', fetchOwnComments);
commentRouter.post('/wishedComment', fetchWishedComment);

export default commentRouter;