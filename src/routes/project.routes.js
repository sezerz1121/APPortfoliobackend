import { Router } from "express";
import { projectListing,projectAll,messageCreation,messageCreationTwo } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for project listing
router.post("/projectlisting",
    upload.fields([
        { name: "projectImageOne", maxCount: 1 }
    ]),
    projectListing
);
router.route("/projectall").get(projectAll)
router.route("/message").post(messageCreation)
router.route("/messageTwo").post(messageCreationTwo)

export default router;
