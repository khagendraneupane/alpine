import { RequestHandler } from "express";
import AppointmentModel from "../models/appointment";
import createHttpError from "http-errors";
import ConsultantModel from "../models/consultant";
import mongoose from "mongoose";


export const getAppointments: RequestHandler = async (req, res, next) => {
    try {
    const appointments = await AppointmentModel.find().exec();
    res.status(200).json(appointments );
    } catch (error) {
        next(error);
    }
    
};

export const getAppointment: RequestHandler = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    try {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const appointment = await AppointmentModel.findById(appointmentId).exec();
        if (!appointment) {
            throw createHttpError(404, "Appointment not found");
        }
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
}

interface CreateAppointmentBody {
    appointment_id: string;
    appointment_date: string;
    appointment_time: string;
    appointment_with: string;
    appointment_status: string;
}
export const createAppointment: RequestHandler<unknown, unknown, CreateAppointmentBody, unknown> = async (req, res, next) => {
    const { appointment_id, appointment_date, appointment_time, appointment_with, appointment_status } = req.body;
        
    try {
        if (!appointment_id || !appointment_date || !appointment_time || !appointment_with || !appointment_status) {
            throw createHttpError(400, "All fields are required");
        }

         // Validate appointment_with as an ObjectId
         if (!mongoose.Types.ObjectId.isValid(appointment_with)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const consultant = await ConsultantModel.findOne({ consultant_name: appointment_with }).exec();
            if (!consultant) {
                throw createHttpError(404, "Consultant not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.appointment_with = consultant._id.toString();
        }

        const newAppointment = new AppointmentModel({ appointment_id, appointment_date, appointment_time, appointment_with:req.body.appointment_with, appointment_status });
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        next(error);
    }
};

interface UpdateAppointmentParams{
    appointmentId: string;
}
interface UpdateAppointmentBody {
    appointment_id: string;
    appointment_date: string;
    appointment_time: string;
    appointment_with: string;
    appointment_status: string;
}

export const updateAppointment: RequestHandler<UpdateAppointmentParams, unknown, UpdateAppointmentBody, unknown> = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    const { appointment_id, appointment_date, appointment_time, appointment_with, appointment_status } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { appointment_id, appointment_date, appointment_time, appointment_with, appointment_status },
            { new: true }
        ).exec();
        if (!updatedAppointment) {
            throw createHttpError(404, "Appointment not found");
        }
        res.status(200).json(updatedAppointment);
    } catch (error) {
        next(error);
    }
};
export const deleteAppointment: RequestHandler = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    try {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const deletedAppointment = await AppointmentModel.findByIdAndDelete(appointmentId).exec();
        if (!deletedAppointment) {
            throw createHttpError(404, "Appointment not found");
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};