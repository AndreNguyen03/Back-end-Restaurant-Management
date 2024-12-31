import express from 'express';
import { getRevenue } from '../controllers/revenueController.js';

const revenueRouter = express.Router();

// Endpoint to get revenue
revenueRouter.get('/revenue', getRevenue);

export default revenueRouter;
