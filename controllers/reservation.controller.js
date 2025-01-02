"use strict";

import { BadRequestError } from "../core/error.response.js";
import { CREATED, OK } from "../core/success.response.js";
import ReservationService from "../services/reservation.service.js";
import { getIo } from "../socket.js";

class ReservationController {
  static async getReservationsByDate(req, res, next) {
    try {
      const { date } = req.query;

      if (!date) {
        throw new BadRequestError("Date is required");
      }

      const reservations = await ReservationService.getReservationsByDate(date);

      new OK({
        message: "Reservations fetched successfully",
        metadata: reservations,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllReservations(req, res, next) {
    try {
      const reservations = await ReservationService.getAllReservations();

      new OK({
        message: "All reservations fetched successfully",
        metadata: reservations,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async createReservation(req, res, next) {
    try {
      const reservation = await ReservationService.createReservation(req.body);

      const io = getIo();

      io.emit("new_reservation")

      new CREATED({
        message: "Reservation created successfully",
        metadata: reservation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async assignTable(req, res, next) {
    try {
      const { reservationId, tableId, duration, status } = req.body;

      const updatedReservation = await ReservationService.assignTable(
        reservationId,
        tableId,
        duration,
        status
      );

      new OK({
        message: "Table assigned successfully",
        metadata: updatedReservation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async cancelReservation(req, res, next) {
    try {
      const { reservationId } = req.body;
      const canceledReservation = await ReservationService.cancelReservation(
        reservationId
      );
      new OK({
        message: "Reservation canceled successfully",
        metadata: canceledReservation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
  static async getAllTables(req, res, next) {
    try {
      const tables = await ReservationService.getAllTables();

      if (tables && tables.length > 0) {
        new OK({
          message: "Tables fetched successfully",
          metadata: tables,
        }).send(res);
      } else {
        new OK({
          message: "No tables found",
          metadata: [],
        }).send(res);
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteReservation(req, res, next) {
    try {
      const { reservationId } = req.params; // Lấy `reservationId` từ params
  
      const deletedReservation = await ReservationService.deleteReservation(
        reservationId
      );
      
  

      new OK({
        message: "Reservation deleted successfully",
        metadata: deletedReservation,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

export default ReservationController;
