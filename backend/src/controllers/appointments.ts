import { RequestHandler } from "express";
import AppointmentModel from "../models/appointment";
import createHttpError from "http-errors";
import ConsultantModel from "../models/consultant";
import mongoose from "mongoose";
import ConsultationModel from "../models/consultation"; // Import ConsultationModel


export const getAppointments: RequestHandler = async (req, res, next) => {
    try {
    const appointments = await AppointmentModel.find()
    .populate("appointment_with", "consultant_name")
    .exec();
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
        const appointment = await AppointmentModel.findById(appointmentId)
        .populate("appointment_with", "consultant_name")
        .exec();
        if (!appointment) {
            throw createHttpError(404, "Appointment not found");
        }
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
}

interface CreateAppointmentBody {
    date: string;
    time: string;
    consultation_type: string;
    consultant_name: string;
    status: "pending" | "confirmed" | "cancelled";
}
export const createAppointment: RequestHandler<unknown, unknown, CreateAppointmentBody, unknown> = async (req, res, next) => {
    const { date, time, consultation_type, consultant_name, status } = req.body;
        
    try {
        if (!date || !time || !consultation_type || !consultant_name || !status) {
            throw createHttpError(400, "All fields are required");
        }

         // Validate appointment_with as an ObjectId
         if (!mongoose.Types.ObjectId.isValid(consultant_name)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const consultant = await ConsultantModel.findOne({ name: consultant_name }).exec();
            if (!consultant) {
                throw createHttpError(404, "Consultant not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.consultant_name = consultant._id.toString();
        }

          // Validate appointment_with as an ObjectId
          if (!mongoose.Types.ObjectId.isValid(consultation_type)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const consultation = await ConsultationModel.findOne({ name: consultation_type }).exec();
            if (!consultation) {
                throw createHttpError(404, "Consultation not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.consultation_type = consultation._id.toString();
        }

        const newAppointment = new AppointmentModel({ date, time, appointment_type:req.body.consultation_type ,consultant_name:req.body.consultant_name, status });
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
    date: string;
    time: string;
    consultation_type: string;
    consultant_name: string;
    appointment_status: string;
}

export const updateAppointment: RequestHandler<UpdateAppointmentParams, unknown, UpdateAppointmentBody, unknown> = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    const { date, time, consultation_type, consultant_name, appointment_status} = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { date, time, consultation_type, consultant_name, appointment_status },
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