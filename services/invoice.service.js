"use strict";

import dishModel from '../models/dishModel.js';
import { invoice } from '../models/invoice.model.js'

class InvoiceService {
    // Tạo customId tăng dần
    static async generateCustomId() {
        const timestamp = Date.now();
        return `INV-${timestamp}`;
      }

    // Tạo hóa đơn mới
    static async createInvoice(data) {
        const customId = await this.generateCustomId();
        const { tableId = "none" , cartData, totalAmount } = data;
    
        // Map through cartData and calculate item details
        const itemDetails = await Promise.all(
          cartData.map(async (item) => {
            const dish = await dishModel.findById(item._id);
            if (!dish) throw new Error(`Dish with ID ${item._id} not found`);
    
            return {
              dish: dish._id,
              name: dish.name,
              quantity: item.quantity || 1, // Default quantity is 1 if not provided
              price: dish.price,
              totalPrice: dish.price * (item.quantity || 1),
            };
          })
        );
    
        const newInvoice = new invoice({
          customId,
          table: tableId,
          total: totalAmount,
          items: itemDetails,
        });
    
        return await newInvoice.save();
      }

    // Lấy hóa đơn theo ngày
    static async getInvoicesByDate(date) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Đầu ngày
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Cuối ngày

        const invoices = await invoice.find({
            dateTime: { $gte: startOfDay, $lte: endOfDay },
        }).populate('items.dish'); // Populate để lấy thông tin món ăn từ Dish model

        return invoices.map((invoice) => ({
            ...invoice.toObject(),
            dateTime: new Date(invoice.dateTime).toLocaleString("vi-VN"),
            items: invoice.items.map(item => ({
                ...item.toObject(),
                dish: item.dish ? item.dish.name : 'Unknown dish', // Lấy tên món ăn
            })),
        }));
    }
}

export default InvoiceService;