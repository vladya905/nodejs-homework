import express from "express";
import { validateBody } from "../../decorators/index.js"
import usersSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js"
import { autenticate } from "../../middleware/index.js"

const authRouter = express.Router();

const userSignupValidate = validateBody(usersSchemas.userSignupSchemas);
const userLoginValidate = validateBody(usersSchemas.userLoginSchemas);

authRouter.post('/users/register', userSignupValidate, authController.signup);
authRouter.post('/users/login', userLoginValidate, authController.signin);
authRouter.get('/users/current', autenticate, authController.getCurrent);
authRouter.post('/users/logout', autenticate, authController.signout)

export default authRouter;