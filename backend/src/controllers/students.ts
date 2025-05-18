import { RequestHandler } from "express";
import StudentModel from "../models/student";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getStudents: RequestHandler = async (req, res, next) => {
    try {
        const students = await StudentModel.find().exec();
        res.status(200).json(students);
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
    student_name: string;
    student_email: string;
    student_phone: string;
    student_nationality: string;
    student_password: string;
}

export const createStudent: RequestHandler<unknown, unknown, CreateStudentBody, unknown> = async (req, res, next) => {
    const { student_name, student_email, student_phone, student_nationality, student_password } = req.body;

    try {
        const newStudent = new StudentModel({
            student_name,
            student_email,
            student_phone,
            student_nationality,
            student_password,
        });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        next(error);
    }
};

interface UpdateStudentParams {
    studentId: string;
}

interface UpdateStudentBody {
    student_name: string;
    student_email: string;
    student_phone: string;
    student_nationality: string;
    student_password: string;
}

export const updateStudent: RequestHandler<UpdateStudentParams, unknown, UpdateStudentBody, unknown> = async (req, res, next) => {
    const studentId = req.params.studentId;
    const { student_name, student_email, student_phone, student_nationality, student_password } = req.body;
    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentId,
            { student_name, student_email, student_phone, student_nationality, student_password },
            { new: true }
        ).exec();
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

export const signupStudent: RequestHandler = async (req, res, next) => {
    const { student_name, student_email, student_phone, student_nationality, student_password } = req.body;

    try {
        if (!student_name || !student_email || !student_phone || !student_nationality || !student_password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const existingStudent = await StudentModel.findOne({ student_email }).exec();
        if (existingStudent) {
            res.status(400).json({ error: "Email is already registered" });
            return;
        }

        const hashedPassword = await bcrypt.hash(student_password, 10);

        const newStudent = new StudentModel({
            student_name,
            student_email,
            student_phone,
            student_nationality,
            student_password: hashedPassword,
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("Error during signup:", error);
        next(error);
    }
};

export const loginStudent: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const student = await StudentModel.findOne({ email }).exec();
        if (!student) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, student.student_password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const token = jwt.sign(
            { userId: student._id, role: "student" },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        next(error);
    }
};

export const logoutStudent: RequestHandler = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        next(error);
    }
};