"use strict";

import { model, Schema } from 'mongoose';
import {tableSchema} from './tableModel.js'

const DOCUMENT_NAME = 'reservation';
const COLLECTION_NAME = 'reservations';

const reservationSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'confirm', 'cancel'], default: 'pending' },
    tableAssigned: tableSchema,
    endTime: { type: Date },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export const ReservationModel = model(DOCUMENT_NAME, reservationSchema);