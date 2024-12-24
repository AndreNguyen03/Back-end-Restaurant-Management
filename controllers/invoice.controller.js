"use strict";

import { CREATED, OK  } from "../core/success.response.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../core/error.response.js";
import InvoiceService from "../services/invoice.service.js";


class InvoiceController {
    // Tạo hóa đơn mới
    static async create(req, res) {
      try {
        const { tableId, cartData, totalAmount } = req.body;

        if (!cartData || !totalAmount) {
          return res.status(400).json({ message: 'Invalid data provided.' });
        }
  
        const invoice = await InvoiceService.createInvoice({ tableId, cartData, totalAmount });
        // Trả về phản hồi thành công với status OK
        return new CREATED({
          message: "Hóa đơn đã được tạo thành công",
          metadata: invoice,
        }).send(res);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return new NotFoundError(error.message);
        } else if (error instanceof ForbiddenError) {
          return new ForbiddenError(error.message);
        } else {
          // Trường hợp lỗi chung
          return new BadRequestError(error.message);
        }
      }
    }
  
    // Lấy hóa đơn theo ngày
    static async getByDate(req, res) {
      try {
        const { date } = req.query;
        if (!date) {
          return new BadRequestError("Ngày không hợp lệ.");
        }
  
        const invoices = await InvoiceService.getInvoicesByDate(new Date(date));
  
        // Trả về thành công với danh sách hóa đơn
        return new OK({
          message: "Lấy danh sách hóa đơn thành công",
          metadata: invoices,
        }).send(res);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return new NotFoundError(error.message);
        } else if (error instanceof ForbiddenError) {
          return new ForbiddenError(error.message);
        } else {
          return new BadRequestError(error.message);
        }
      }
    }
  }
  
  export default InvoiceController;