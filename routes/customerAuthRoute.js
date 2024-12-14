import express from 'express' 
import { customerRegister, customerLogin, checkAuth, logout, getOTP, changePassword, getProfile, updateProfile } from '../controllers/customerAuthController.js'
const customerAuthRouter = express.Router();

customerAuthRouter.post('/register',
    customerRegister
); // return a 400 response if any of the checks fail


customerAuthRouter.post('/login',customerLogin
)

customerAuthRouter.get('/checkAuth', checkAuth)

customerAuthRouter.get('/logout', logout);

customerAuthRouter.post('/getOTP', getOTP);
export default customerAuthRouter;

customerAuthRouter.post('/changepassword', changePassword); 

customerAuthRouter.get('/profile', getProfile);

customerAuthRouter.post('/updateprofile', updateProfile);