import { RequestHandler } from "express";
import AdminModel from "../models/admin";

export const getAdmins: RequestHandler = async (req, res, next) => {
    try {

    const admins = await AdminModel.find().exec();

    res.status(200).json(admins );
    } catch (error) {
        next(error);
    }
    
};

export const getAdmin: RequestHandler = async (req, res, next) => {
    const adminId = req.params.adminId;
    try {
        const admin = await AdminModel.findById(adminId).exec();
        res.status(200).json(admin);
    
    } catch (error) {
        next(error);
    }
    
};


export const createAdmin: RequestHandler = async (req, res, next) => {
    const {admin_name, admin_email, admin_phone, admin_password } = req.body;
        
    try {
        const newAdmin = new AdminModel({admin_name, admin_email, admin_phone, admin_password });
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (error) {
        next(error);
    }
};

interface UpdateAdminParams{
    adminId: string;
}
interface UpdateAdminBody {

    admin_name: string;
    admin_email: string;
    admin_phone: string;
    admin_password: string;
}
export const updateAdmin: RequestHandler<UpdateAdminParams, unknown, UpdateAdminBody, unknown> = async (req, res, next) => {
    const adminId = req.params.adminId;
    const {  admin_name, admin_email, admin_phone, admin_password } = req.body;
    
    try {
        const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, {  admin_name, admin_email, admin_phone, admin_password }, { new: true }).exec();
        if (!updatedAdmin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        next(error);
    }
};

export const deleteAdmin: RequestHandler = async (req, res, next) => {
    const adminId = req.params.adminId;
    
    try {
        const deletedAdmin = await AdminModel.findByIdAndDelete(adminId).exec();
        if (!deletedAdmin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        next(error);
    }
};