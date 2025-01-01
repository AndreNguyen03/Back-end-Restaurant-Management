import express from 'express';
import { handleZaloPayCallback, fetchOrders, updateOrderStatus } from '../controllers/orderController.js';
const orderRouter = express.Router();

orderRouter.post('/add', handleZaloPayCallback);
orderRouter.get('/fetch', fetchOrders);
orderRouter.post('/update', updateOrderStatus);
export default orderRouter;