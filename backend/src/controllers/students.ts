import { RequestHandler } from "express";
import StudentModel from "../models/student";

export const getStudents: RequestHandler = async (req, res, next) => {
    try {

    const students = await StudentModel.find().exec();

    res.status(200).json(students );
    } catch (error) {
        next(error);
    }
    
};
export const getStudent: RequestHandler = async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        const student = await StudentModel.findById(studentId).exec();
        res.status(200).json(student);
    
    } catch (error) {
        next(error);
    }
    
};

interface CreateStudentBody {
    student_id: string;
    student_name: string;
    student_email: string;
    student_phone: string;
    student_nationality: string;
    student_password: string;
}


export const createStudent: RequestHandler<unknown, unknown, CreateStudentBody, unknown> = async (req, res, next) => {
    const { student_id, student_name, student_email, student_phone, student_nationality, student_password } = req.body;
        
    try {
        const newStudent = new StudentModel({ student_id, student_name, student_email, student_phone, student_nationality, student_password });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        next(error);
    }
};

interface UpdateStudentParams{
    studentId: string;
}

interface UpdateStudentBody {
    student_id: string;
    student_name: string;
    student_email: string;
    student_phone: string;
    student_nationality: string;
    student_password: string;
}

export const updateStudent: RequestHandler<UpdateStudentParams, unknown, UpdateStudentBody, unknown> = async (req, res, next) => {
    const studentId = req.params.studentId;
    const {student_id, student_name, student_email, student_phone, student_nationality, student_password} = req.body;
    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, { student_id, student_name, student_email, student_phone, student_nationality, student_password }, { new: true }).exec();
        if (!updatedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        next(error);
    }
};

export const deleteStudent: RequestHandler = async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        const deletedStudent = await StudentModel.findByIdAndDelete(studentId).exec();
        if (!deletedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};