import express from "express"; 
import * as ConsultationController from "../controllers/consultation";

const router = express.Router();
router.get("/", ConsultationController.getConsultations);
router.post("/create", ConsultationController.createConsultation);
router.get("/:consultationId", ConsultationController.getConsultation);
router.patch("/:consultationId", ConsultationController.updateConsultation);
router.delete("/:consultationId", ConsultationController.deleteConsultation);


export default router;