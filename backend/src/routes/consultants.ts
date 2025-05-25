import express from "express"; 
import * as ConsultantsController from "../controllers/consultants";

const router = express.Router();
router.get("/", ConsultantsController.getConsultants);
router.post("/create", ConsultantsController.createConsultantWithImage);
router.get("/:consultantId", ConsultantsController.getConsultant);
router.patch("/:consultantId", ConsultantsController.updateConsultant);
router.delete("/:consultantId", ConsultantsController.deleteConsultant);


export default router;