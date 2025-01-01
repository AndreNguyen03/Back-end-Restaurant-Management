import express from 'express';
import { handleZaloPayCallback, fetchOrders } from '../controllers/orderController.js';
const orderRouter = express.Router();

orderRouter.post('/add', handleZaloPayCallback);
orderRouter.get('/fetch', fetchOrders);

export default orderRouter;