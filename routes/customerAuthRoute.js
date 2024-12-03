import express from 'express' 
import { customerRegister, customerLogin } from '../controllers/customerAuthController.js'
import Validate from '../middleware/validate.js';
import { check } from 'express-validator';
const customerAuthRouter = express.Router();

customerAuthRouter.post('/register',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    check('fullName')
        .not()
        .isEmpty()
        .withMessage('Full name is required'),
    check('phoneNumber')
        .notEmpty()
        .isNumeric()
        .isLength({ min: 10, max: 10 }),
    check('username')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Username must be at least 8 characters long'),
    check('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 6 characters long'),
    Validate,
    customerRegister
); // return a 400 response if any of the checks fail


customerAuthRouter.post('/login',
    check('username')
        .notEmpty()
        .withMessage('Username is required'),
    check('password')
        .notEmpty()
        .withMessage('Password is required'),
    Validate,
    customerLogin
)

export default customerAuthRouter;