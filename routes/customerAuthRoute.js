import express from 'express' 
import { customerRegister, customerLogin, checkAuth, logout, getOTP, changePassword, getProfile, updateProfile } from '../controllers/customerAuthController.js'
const customerAuthRouter = express.Router();

customerAuthRouter.post('/register',
    customerRegister
);


customerAuthRouter.post('/login',customerLogin
)

customerAuthRouter.get('/checkAuth', checkAuth)

customerAuthRouter.get('/logout', logout);

customerAuthRouter.post('/getOTP', getOTP);

customerAuthRouter.post('/changepassword', changePassword); 

customerAuthRouter.get('/profile', getProfile);

customerAuthRouter.post('/updateprofile', updateProfile);

export default customerAuthRouter;
