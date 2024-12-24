// Route đăng nhập, đăng ký cho nhân viên
import express from 'express'
import { Register, Login, checkAuth, logout } from '../controllers/AuthController.js'

const authRouter = express.Router();

authRouter.post('/register',Register)

authRouter.post('/login',Login)

authRouter.get('/checkAuth', checkAuth);
authRouter.get('/logout', logout);

export default authRouter;