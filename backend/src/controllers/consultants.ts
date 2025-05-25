import { RequestHandler } from "express";
import ConsultantModel from "../models/consultant";
import ServiceModel from "../models/service";
import createHttpError from "http-errors";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// file upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/consultant/images/')
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

 // add consultant
 const createConsultant: RequestHandler = async (req, res, next) => {
    const {name, specialization, email, phone, plain_password} = req.body;

    try {
        if (!plain_password) {
            res.status(400).json({ message: "Password is required" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: "Please upload an image file" });
            return;
        }
        const hashedPassword = await bcrypt.hash(plain_password, 10);
        const newConsultant = new ConsultantModel({
            name,
            specialization,
            email,
            phone,
            image: {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
            },
            password: hashedPassword,
        });
        // save the consultant to database
        const savedConsultant = await newConsultant.save();
        res.status(201).json(savedConsultant);
    } catch (error) {
        console.error("Error while creating consultant:", error);
        next(error);
    }
 };


export const createConsultantWithImage = [upload.single("image"), createConsultant];

export const getConsultants: RequestHandler = async (req, res, next) => {
    try {
    const consultants = await ConsultantModel.find({}, "name").exec();
    res.status(200).json(consultants );
    } catch (error) {
        next(error);
    }
    
};

export const getConsultant: RequestHandler = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    try {

        const consultant = await ConsultantModel.findById(consultantId).exec();
        if (!consultant) {
            throw createHttpError(404, "Consultant not found");
            return;
        }
        res.status(200).json(consultant);
    } catch (error) {
        next(error);
    }
};

// updateConsultant
interface UpdateConsultantParams{
    consultantId: string;
}

interface UpdateConsultantBody {
    name: string;
    specialization: string;
    email: string;
    phone: string;
    image?: {
        filename: string;
        path: string;
        mimetype: string;
    };
    password: string;
}

// update consultant
export const updateConsultant: RequestHandler<UpdateConsultantParams, unknown, UpdateConsultantBody, unknown> = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    const {  name, specialization, email, phone, password } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(consultantId)) {
            throw createHttpError(400, "Invalid consultant ID");
        }

        if ( !name || !specialization || !email || !phone || !password) {
            throw createHttpError(400, "All fields are required");
        }

        // Validate appointment_with as an ObjectId
        if (!mongoose.Types.ObjectId.isValid(specialization)) {
            // If it's not a valid ObjectId, try to find the consultant by name
            const service = await ServiceModel.findOne({ name: specialization }).exec();
            if (!service) {
                throw createHttpError(404, "Service not found");
            }
            // Replace appointment_with with the consultant's _id
            req.body.specialization = service._id.toString();
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.specialization)) {
            next(createHttpError(400, "Invalid specialization ID"));
            return;
        }

        const updatedConsultant = await ConsultantModel.findByIdAndUpdate(consultantId, {name, specialization:req.body.specialization , email, phone, password }, { new: true }).exec();
        if (!updatedConsultant) {
            res.status(404).json({ message: "Consultant not found" });
            return;
        }
        res.status(200).json(updatedConsultant);
    } catch (error) {
        next(error);
    }
};

// search consultant by name
export const searchConsultants: RequestHandler = async (req, res, next) => {
    const { name } = req.query;

    console.log("Search query received:", name); // Debugging log

    try {
        if (!name) {
            console.log("Name query parameter is missing"); // Debugging log
            res.status(400).json({ error: "Name query parameter is required" });
            return;
        }

        // Explicitly search the consultant_name field
        const consultants = await ConsultantModel.find({
            name: { $regex: name, $options: "i" }, // Case-insensitive search
        }).exec();

        console.log("Consultants found:", consultants); // Debugging log

        res.status(200).json(consultants);
    } catch (error) {
        console.error("Error in searchConsultants:", error); // Debugging log
        next(error);
    }
};

export const deleteConsultant: RequestHandler = async (req, res, next) => {
    const consultantId = req.params.consultantId;

    try {
        // Find the consultant by ID
        const consultant = await ConsultantModel.findById(consultantId).exec();
        if (!consultant) {
            res.status(404).json({ message: "Consultant not found" });
            return;
        }

        // Delete the linked image file if it exists
        if (consultant.image && typeof consultant.image === 'object' && 'path' in consultant.image) {
            const imagePath = path.resolve((consultant.image as { path: string }).path);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully:", imagePath);
                }
            });
        }

        // Delete the consultant from the database
        const deletedConsultant = await ConsultantModel.findByIdAndDelete(consultantId).exec();
        if (!deletedConsultant) {
            res.status(404).json({ message: "Consultant not found" });
            return;
        }

        res.status(200).json({ message: "Consultant deleted successfully" });
    } catch (error) {
        console.error("Error while deleting consultant:", error);
        next(error);
    }
}

interface ChangePasswordParams {
    consultantId: string;
}

interface ChangePasswordBody {
    oldPassword: string;
    newPassword: string;
}

export const changePassword: RequestHandler<ChangePasswordParams, unknown, ChangePasswordBody, unknown> = async (req, res, next) => {
    const consultantId = req.params.consultantId;
    const { oldPassword, newPassword } = req.body;

    try {
        // Validate consultant ID
        if (!mongoose.Types.ObjectId.isValid(consultantId)) {
            throw createHttpError(400, "Invalid consultant ID");
        }

        // Validate required fields
        if (!oldPassword || !newPassword) {
            throw createHttpError(400, "Both old and new passwords are required");
        }

        // Find the consultant by ID
        const consultant = await ConsultantModel.findById(consultantId).exec();
        if (!consultant) {
            throw createHttpError(404, "Consultant not found");
        }

        // Verify the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, consultant.password);
        if (!isPasswordValid) {
            throw createHttpError(401, "Old password is incorrect");
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the consultant's password
        consultant.password = hashedNewPassword;
        await consultant.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error while changing password:", error);
        next(error);
    }
};