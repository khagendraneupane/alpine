import express from "express"; 
import * as AdminsController from "../controllers/admins";

const router = express.Router();
router.get("/", AdminsController.getAdmins);
router.get("/:adminId", AdminsController.getAdmin);
router.post("/", AdminsController.createAdmin);
router.patch("/:adminId", AdminsController.updateAdmin);
router.delete("/:adminId", AdminsController.deleteAdmin);

export default router;