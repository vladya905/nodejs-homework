import Joi from "joi";
import { emailRegexp } from "../constans/user-constans.js";

const userSignupSchemas = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required().min(6),
    subscription: Joi.string()
});

const userLoginSchemas = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required().min(6),
});

const userEmailSchemas = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});

export default {
    userSignupSchemas,
    userLoginSchemas,
    userEmailSchemas
}