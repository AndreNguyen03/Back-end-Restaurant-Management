// Route đăng nhập, đăng ký cho nhân viên
import express from 'express'
import { addAddress, fetchAddress, deleteAddress, setDefault, getDefaultAddress } from '../controllers/addressController.js'

const addressRouter = express.Router();

addressRouter.post('/add',addAddress)

addressRouter.post('/fetchList',fetchAddress
)

addressRouter.post('/delete',deleteAddress)

addressRouter.post('/setDefault',setDefault)
addressRouter.post('/getDefault',getDefaultAddress)

export default addressRouter;