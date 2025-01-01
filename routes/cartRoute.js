// Route đăng nhập, đăng ký cho nhân viên
import express from 'express'
import { updateCart, getCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/update',updateCart)

cartRouter.get('/getCart',getCart)


export default cartRouter;