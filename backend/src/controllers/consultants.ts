import { RequestHandler } from "express";
import ConsultantModel from "../models/consultant";
import ServiceModel from "../models/service";
import createHttpError from "http-errors";
import mongoose from "mongoose";


export const getConsultants: RequestHandler = async (req, res, next) => {
    try {
    const consultants = await ConsultantModel.find().exec();
    res.status(200).json(consultants );
    } catch (error) {
        next(error);
    }
    
}
export const getConsultant: RequestHandler = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    try {

        const consultant = await ConsultantModel.findById(consultantId).exec();
        if (!consultant) {
            throw createHttpError(404, "Consultant not found");
        }
        res.status(200).json(consultant);
    } catch (error) {
        next(error);
    }
};

interface CreateConsultantBody {
    consultant_id: string;
    consultant_name: string;
    consultant_specialization: string;
    consultant_email: string;
    consultant_phone: string;
    consultant_password: string;
}


export const createConsultant: RequestHandler<unknown, unknown, CreateConsultantBody, unknown> = async (req, res, next) => {
    const { consultant_id, consultant_name, consultant_specialization, consultant_email, consultant_phone, consultant_password } = req.body;
        
    try {
        if (!consultant_id || !consultant_name || !consultant_specialization || !consultant_email || !consultant_phone || !consultant_password) {
            throw createHttpError(400, "All fields are required");
        }

        // Validate appointment_with as an ObjectId
        if (!mongoose.Types.ObjectId.isValid(consultant_specialization)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const service = await ServiceModel.findOne({ service_name: consultant_specialization }).exec();
            if (!service) {
                throw createHttpError(404, "Service not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.consultant_specialization = service._id.toString();
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.consultant_specialization)) {
            next(createHttpError(400, "Invalid specialization ID"));
            return;
        }

        const newConsultant = new ConsultantModel({ consultant_id, consultant_name, consultant_specialization, consultant_email, consultant_phone, consultant_password });
        const savedConsultant = await newConsultant.save();
        res.status(201).json(savedConsultant);
    } catch (error) {
        next(error);
    }
};

interface UpdateConsultantParams{
    consultantId: string;
}
interface UpdateConsultantBody {
    consultant_id: string;
    consultant_name: string;
    consultant_specialization: string;
    consultant_email: string;
    consultant_phone: string;
    consultant_password: string;
}
export const updateConsultant: RequestHandler<UpdateConsultantParams, unknown, UpdateConsultantBody, unknown> = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    const { consultant_id, consultant_name, consultant_specialization, consultant_email, consultant_phone, consultant_password } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(consultantId)) {
            throw createHttpError(400, "Invalid consultant ID");
        }

        if (!consultant_id || !consultant_name || !consultant_specialization || !consultant_email || !consultant_phone || !consultant_password) {
            throw createHttpError(400, "All fields are required");
        }

        // Validate appointment_with as an ObjectId
        if (!mongoose.Types.ObjectId.isValid(consultant_specialization)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const service = await ServiceModel.findOne({ service_name: consultant_specialization }).exec();
            if (!service) {
                throw createHttpError(404, "Service not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.consultant_specialization = service._id.toString();
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.consultant_specialization)) {
            next(createHttpError(400, "Invalid specialization ID"));
            return;
        }

        const updatedConsultant = await ConsultantModel.findByIdAndUpdate(consultantId, { consultant_id, consultant_name, consultant_specialization:req.body.consultant_specialization , consultant_email, consultant_phone, consultant_password }, { new: true }).exec();
        if (!updatedConsultant) {
            res.status(404).json({ message: "Consultant not found" });
            return;
        }
        res.status(200).json(updatedConsultant);
    } catch (error) {
        next(error);
    }
};
export const deleteConsultant: RequestHandler = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    try {
        if (!mongoose.Types.ObjectId.isValid(consultantId)) {
            throw createHttpError(400, "Invalid consultant ID");
        }
        const deletedConsultant = await ConsultantModel.findByIdAndDelete(consultantId).exec();
        if (!deletedConsultant) {
            res.status(404).json({ message: "Consultant not found" });
            return;
        }
        res.status(200).json({ message: "Consultant deleted successfully" });
    } catch (error) {
        next(error);
    }
};