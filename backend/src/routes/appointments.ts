import express from "express"; 
import * as AppointmentsController from "../controllers/appointments";

const router = express.Router();
router.get("/", AppointmentsController.getAppointments);
router.get("/:appointmentId", AppointmentsController.getAppointment);
router.post("/", AppointmentsController.createAppointment);
router.patch("/:appointmentId", AppointmentsController.updateAppointment);
router.delete("/:appointmentId", AppointmentsController.deleteAppointment);

export default router;