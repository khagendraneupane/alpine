import { RequestHandler } from "express";
import AppointmentModel from "../models/appointment";
import createHttpError from "http-errors";
import ConsultationModel from "../models/consultation";
import mongoose from "mongoose";


export const getConsultations: RequestHandler = async (req, res, next) => {
    try {
    const appointments = await ConsultationModel.find({}, "consultation_type").exec();
    res.status(200).json(appointments );
    } catch (error) {
        next(error);
    }
    
};

export const getConsultation: RequestHandler = async (req, res, next) => {
    const consultationId = req.params.consultationId;
    try {
        if (!mongoose.Types.ObjectId.isValid(consultationId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const consultation = await AppointmentModel.findById(consultationId).exec();
        if (!consultation) {
            throw createHttpError(404, "COnsultation not available right now");
        }
        res.status(200).json(consultation);
    } catch (error) {
        next(error);
    }
}

interface CreateConsultationBody {
    consultation_type: string;
    consultation_duration: string;
}
export const createConsultation: RequestHandler<unknown, unknown, CreateConsultationBody, unknown> = async (req, res, next) => {
    const { consultation_type, consultation_duration } = req.body;
        
    try {
        if (!consultation_type || !consultation_duration) {
            throw createHttpError(400, "All fields are required");
        }

        const newConsultation = new AppointmentModel({ consultation_type, consultation_duration });
        const savedConsultation = await newConsultation.save();
        res.status(201).json(savedConsultation);
    } catch (error) {
        next(error);
    }
};

interface UpdateConsultationParams{
    consultationId: string;
}
interface UpdateConsultationBody {
    consultation_type: string;
    consultation_duration: string;
}

export const updateConsultation: RequestHandler<UpdateConsultationParams, unknown, UpdateConsultationBody, unknown> = async (req, res, next) => {
    const consultationId = req.params.consultationId;
    const { consultation_type, consultation_duration } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(consultationId)) {
            throw createHttpError(400, "Invalid appointment ID");
        }
        const updatedConsultation = await ConsultationModel.findByIdAndUpdate(
            consultationId,
            { consultation_type, consultation_duration },
            { new: true }
        ).exec();
        if (!updatedConsultation) {
            throw createHttpError(404, "Appointment not found");
        }
        res.status(200).json(updatedConsultation);
    } catch (error) {
        next(error);
    }
};
export const deleteConsultation: RequestHandler = async (req, res, next) => {
    const consultationId = req.params.consultationId;
    try {
        if (!mongoose.Types.ObjectId.isValid(consultationId)) {
            throw createHttpError(400, "Invalid consultation ID");
        }
        const deletedConsultation = await ConsultationModel.findByIdAndDelete(consultationId).exec();
        if (!deletedConsultation) {
            throw createHttpError(404, "Consultation not found");
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};