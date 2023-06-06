import express from "express";
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController
} from '../controller/authController.js'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// Router Object
const router = express.Router()

// routing
// REGISTER || POST
router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

// Forgot Password || POST
router.post('/forgot-password', forgotPasswordController);

// test route
router.get('/test', requireSignIn, isAdmin, testController);

// proected route
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

// admin protected route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

// update profile
router.put('/profile', requireSignIn, updateProfileController);


export default router;
