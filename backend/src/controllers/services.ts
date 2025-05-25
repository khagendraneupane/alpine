import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import ServiceModel from "../models/service";



// multer file upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Please upload jpg or png file only!"));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    }
 });

const createService: RequestHandler = async (req, res, next) => {
    const { name, category, description, rate } = req.body;

    try {
        if (!req.file) {
            res.status(400).json({ message: "Please upload an image file" });
            return;
        }
        const newService = new ServiceModel({
            name,
            category,
            description,
            rate,
            image: {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
            },
        });
        // save the service to database
        const savedService = await newService.save();

        res.status(201).json(savedService);
    } catch (error) {
        console.error("Error while creating service:", error);
        next(error);

    }
};
// export the route with the multer middleware
export const createServiceWithImage = [upload.single("image"), createService];

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

// update service
interface UpdateServiceParams{
    serviceId: string;
}

interface UpdateServiceBody {
    name: string;
    category: string;
    description: string;
    rate: number;
    image?: {
        filename: string;
        path: string;
        mimetype: string;
    };
}
export const updateService: RequestHandler<UpdateServiceParams> = async (req, res, next) => {
    const serviceId = req.params.serviceId;
    const {  name, category, description, rate } = req.body;
    
    try {
        const updateData: Partial<UpdateServiceBody> = {

            name,
            category,
            description,
            rate,
        };
        if (req.file) {
            updateData.image = {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
        };
    }
        const updatedService = await ServiceModel.findByIdAndUpdate(serviceId, updateData, { new: true }).exec();
        if (!updatedService) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        res.status(200).json(updatedService);
    } catch (error) {
        console.error("Error while updating service:", error);
        next(error);
    }
}

// delete service
export const deleteService: RequestHandler = async (req, res, next) => {
    const serviceId = req.params.serviceId;

    try {
        // Find the service by ID
        const service = await ServiceModel.findById(serviceId).exec();
        if (!service) {
            res.status(404).json({ message: "Service not found" });
            return;
        }

        // Delete the linked image file if it exists
        if (service.image && typeof service.image === 'object' && 'path' in service.image) {
            const imagePath = path.resolve((service.image as { path: string }).path);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully:", imagePath);
                }
            });
        }

        // Delete the service from the database
        const deletedService = await ServiceModel.findByIdAndDelete(serviceId).exec();
        if (!deletedService) {
            res.status(404).json({ message: "Service not found" });
            return;
        }

        res.status(200).json({ message: "Service and linked image deleted successfully" });
    } catch (error) {
        console.error("Error while deleting service:", error);
        next(error);
    }
};
