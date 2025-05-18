import express from "express";
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    signupStudent,
    loginStudent,
    logoutStudent,
} from "../controllers/students";

const router = express.Router();

// Define specific routes first
router.post("/signup", signupStudent); // Signup route
router.post("/login", loginStudent); // Login route
router.post("/logout", logoutStudent); // Logout route

// Define parameterized routes after specific routes
router.get("/", getStudents);
router.get("/:studentId", getStudent);
router.post("/", createStudent);
router.patch("/:studentId", updateStudent);
router.delete("/:studentId", deleteStudent);

export default router;