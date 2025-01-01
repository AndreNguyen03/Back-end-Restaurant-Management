import express from 'express';
import { createZaloPayOrder } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-order', createZaloPayOrder);

export default paymentRouter;