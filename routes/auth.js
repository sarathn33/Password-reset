import {Router} from "express";
import {
    login,
    signup,
    forgotPassword,
    passwordReset
} from "../controllers/authController.js";

export const loginRoute = Router().post("/",login);

export const signupRoute = Router().post("/",signup);

export const forgotPasswordRoute = Router().post("/",forgotPassword);

export const passwordResetRoute = Router().post("/",passwordReset);