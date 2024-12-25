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
        const { tableName = "none" , cartData, totalAmount } = data;
    
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
          table: tableName,
          total: totalAmount,
          items: itemDetails,
        });
    
        return await newInvoice.save();
      }

    // Lấy hóa đơn theo ngày
    static async getInvoicesByDate(date) {
        console.log(`invoicedate`,date);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        console.log(`startday`,startOfDay);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        console.log(`endday`,endOfDay);
      
        const invoices = await invoice.find({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });
        
        console.log(invoices)

        return invoices;
      }
}

export default InvoiceService;