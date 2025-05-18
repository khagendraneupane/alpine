import express from "express"; 
import * as ConsultantsController from "../controllers/consultants";

const router = express.Router();
router.get("/", ConsultantsController.getConsultants);
router.post("/", ConsultantsController.createConsultant);
router.get("/:consultantId", ConsultantsController.getConsultant);
router.patch("/:consultantId", ConsultantsController.updateConsultant);
router.delete("/:consultantId", ConsultantsController.deleteConsultant);
router.get("/search", ConsultantsController.searchConsultants);

export default router;