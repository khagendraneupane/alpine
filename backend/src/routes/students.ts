import express from "express"; 
import * as StudentsController from "../controllers/students";

const router = express.Router();
router.get("/", StudentsController.getStudents);
router.post("/", StudentsController.createStudent);
router.get("/:studentId", StudentsController.getStudent);
router.patch("/:studentId", StudentsController.updateStudent);
router.delete("/:studentId", StudentsController.deleteStudent);
export default router;