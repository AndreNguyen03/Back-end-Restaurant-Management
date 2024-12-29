import express from 'express';
import InvoiceController from '../controllers/invoice.controller.js';

const router = express.Router();

router.post('/', InvoiceController.create);

router.get("/", InvoiceController.getByDate);

export default router;