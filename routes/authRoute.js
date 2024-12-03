// Route đăng nhập, đăng ký cho nhân viên
import express from 'express'
import { Register, Login, checkAuth, logout } from '../controllers/AuthController.js'
import Validate from '../middleware/validate.js';
import { check } from 'express-validator';

const authRouter = express.Router();

authRouter.post('/register',
    check('fullName')
    .notEmpty()
    .withMessage('Full name is required'),
    check('phoneNumber')
    .notEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 }),   
    check('address')
    .notEmpty()
    .withMessage('Address is required'),
    check('employeeRole')
    .notEmpty()
    .withMessage('Role is required'),
    check('username')
    .notEmpty()
    .isLength({min: 8})
    .withMessage('Username must be at least 8 characters long'),  
    check('password')   
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
    Validate,
    Register
)

authRouter.post('/login',
    check('username')
    .notEmpty()
    .withMessage('Username is required'),
    check('password')
    .notEmpty()
    .withMessage('Password is required'),
    Validate,
    Login
)

authRouter.get('/checkAuth', checkAuth);
authRouter.get('/logout', logout);

export default authRouter;