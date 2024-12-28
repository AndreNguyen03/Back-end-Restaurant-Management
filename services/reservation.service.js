import {ReservationModel} from "../models/reservation.model.js";
import TableModel from "../models/tableModel.js";
import { NotFoundError, BadRequestError } from '../core/error.response.js'

class ReservationService {
    // Tạo mới một đặt bàn
    static async createReservation(data) {
        const { name, email, phone, date, time, message } = data;
    
        // Validate input
        if (!name || !email || !phone || !date || !time) {
            throw new BadRequestError("Missing required fields");
        }
    
        // Chuyển đổi date và time thành kiểu Date
        const reservationDate = new Date(date);
        const startTime = new Date(`${date}T${time}`);
    
        if (isNaN(reservationDate.getTime()) || isNaN(startTime.getTime())) {
            throw new BadRequestError("Invalid date or time format");
        }
    
        const reservation = new ReservationModel({
            name,
            email,
            phone,
            date: reservationDate,
            startTime, 
            message,
        });
    
        return await reservation.save();
    }
    

    static async assignTable(reservationId, tableId, duration, status = "confirm") {
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new NotFoundError("Reservation not found");
        }
    
        const table = await TableModel.findById(tableId);
        if (!table) {
            throw new NotFoundError("Table not found");
        }
    
        // Validate reservation.date
        if (!reservation.date || isNaN(new Date(reservation.date).getTime())) {
            throw new BadRequestError("Invalid reservation date");
        }
    
        // Validate reservation.startTime
        const startTime = new Date(reservation.startTime); // Lấy trực tiếp từ trường startTime
        if (!startTime || isNaN(startTime.getTime())) {
            throw new BadRequestError("Invalid or missing start time");
        }
    
        // Validate duration
        if (!duration || duration <= 0) {
            throw new BadRequestError("Duration must be greater than 0");
        }
    
        // Tính toán thời gian kết thúc
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
    
        // Cập nhật thông tin reservation
        reservation.tableAssigned = {
            name: table.name,
            capacity: table.capacity,
        };
        reservation.status = status;
        reservation.endTime = endTime;
    
        return await reservation.save();
    }
    
    

    // Hủy đặt bàn
    static async cancelReservation(reservationId) {
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new NotFoundError("Reservation not found");
        }

        reservation.status = "cancel";
        return await reservation.save();
    }

    static async getReservationsByDate(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
      
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
      
        return await ReservationModel.find({
          date: {
            $gte: startOfDay,  
            $lte: endOfDay,   
          },
        });
      }
      
      
}

export default ReservationService;
