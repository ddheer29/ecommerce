import express from "express";
import { registerController, loginController, testController } from '../controller/authController.js'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// Router Object
const router = express.Router()

// routing
// REGISTER || POST
router.post('/register', registerController);
// LOGIN || POST
router.post('/login', loginController);

// test route
router.get('/test', requireSignIn, isAdmin, testController);

export default router;
