import express from "express";
import ReservationController from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/create", ReservationController.createReservation);

router.patch("/assign-table", ReservationController.assignTable);

router.patch("/cancel", ReservationController.cancelReservation);

router.get("/by-date", ReservationController.getReservationsByDate);

export default router;
