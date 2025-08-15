import { Router } from "express";
const router = Router();
import controller from "../controllers/branchesController.js";

router.post("/", controller.create);
router.get("/", controller.readAll);
router.get("/:id", controller.readOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
