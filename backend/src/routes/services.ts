import express from "express"; 
import * as ServicesController from "../controllers/services";

const router = express.Router();
router.get("/", ServicesController.getServices);
router.post("/create", ServicesController.createServiceWithImage);
router.get("/:serviceId", ServicesController.getService);
router.patch("/:serviceId", ServicesController.updateService);
router.delete("/:serviceId", ServicesController.deleteService);

export default router;