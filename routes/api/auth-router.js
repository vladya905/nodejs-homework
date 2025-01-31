import express from "express";
import { validateBody } from "../../decorators/index.js"
import usersSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js"
import { autenticate, upload } from "../../middleware/index.js"


const authRouter = express.Router();

const userSignupValidate = validateBody(usersSchemas.userSignupSchemas);
const userLoginValidate = validateBody(usersSchemas.userLoginSchemas);
const userEmailValidate = validateBody(usersSchemas.userEmailSchemas);

authRouter.post('/users/register', userSignupValidate, authController.signup);
authRouter.post('/users/login', userLoginValidate, authController.signin);
authRouter.get('/users/current', autenticate, authController.getCurrent);
authRouter.patch('/users/avatars', upload.single("avatar"), autenticate, authController.updateAvatar);
authRouter.get('/users/verify/:verificationToken', authController.verify);
authRouter.post('/users/verify', userEmailValidate, authController.resendVerifyEmail)




export default authRouter;