"use strict";

import { BadRequestError } from "../core/error.response.js";
import { CREATED, OK } from "../core/success.response.js";
import ReservationService from "../services/reservation.service.js";

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


    static async createReservation(req, res, next) {
        try {
            const reservation = await ReservationService.createReservation(req.body);
            new CREATED({ message: "Reservation created successfully", metadata: reservation }).send(res);
        } catch (error) {
            next(error); // Pass error to middleware
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
            const canceledReservation = await ReservationService.cancelReservation(reservationId);
            new OK({ message: "Reservation canceled successfully", metadata: canceledReservation }).send(res);
        } catch (error) {
            next(error); // Pass error to middleware
        }
    }

}

export default ReservationController;