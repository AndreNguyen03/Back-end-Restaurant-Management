import express from 'express';
import { addPurchase, listPurchases, listSpecificPurchase } from '../controllers/purchaseController.js';

const purchaseRouter = express.Router();

purchaseRouter.post('/add', addPurchase);
purchaseRouter.get('/list', listPurchases);
purchaseRouter.post('/specificList', listSpecificPurchase);


export default purchaseRouter;
