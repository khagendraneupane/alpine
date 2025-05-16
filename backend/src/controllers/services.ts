import { RequestHandler } from "express";
import ServiceModel from "../models/service";

export const getServices: RequestHandler = async (req, res, next) => {
    try {

    const services = await ServiceModel.find().exec();

    res.status(200).json(services );
    } catch (error) {
        next(error);
    }
    
};
export const getService: RequestHandler = async (req, res, next) => {
    const serviceId = req.params.serviceId;
    try {
        const service = await ServiceModel.findById(serviceId).exec();
        if (!service) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

export const createService: RequestHandler = async (req, res, next) => {
    const {service_id, service_name, service_description } = req.body;
        
    try {
        const newService = new ServiceModel({ service_id, service_name, service_description });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        next(error);
    }
};

interface UpdateServiceParams{
    serviceId: string;
}
interface UpdateServiceBody {
    service_id: string;
    service_name: string;
    service_description: string;
}
export const updateService: RequestHandler<UpdateServiceParams, unknown, UpdateServiceBody, unknown> = async (req, res, next) => {
    const serviceId = req.params.serviceId;
    const { service_id, service_name, service_description } = req.body;
    
    try {
        const updatedService = await ServiceModel.findByIdAndUpdate(serviceId, { service_id, service_name, service_description }, { new: true }).exec();
        if (!updatedService) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        res.status(200).json(updatedService);
    } catch (error) {
        next(error);
    }
};
export const deleteService: RequestHandler = async (req, res, next) => {
    const serviceId = req.params.serviceId;
    try {
        const deletedService = await ServiceModel.findByIdAndDelete(serviceId).exec();
        if (!deletedService) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        next(error);
    }
};