import express from 'express' 
import { customerRegister, customerLogin } from '../controllers/customerAuthController.js'
const customerAuthRouter = express.Router();

customerAuthRouter.post('/register',
    customerRegister
); // return a 400 response if any of the checks fail


customerAuthRouter.post('/login',customerLogin
)

export default customerAuthRouter;