import Joi from "joi";

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": `missing required name field`}),
  email: Joi.string().required().messages({ "any.required": `missing required email field`}),
  phone: Joi.string().min(3).max(10).required().messages({ "any.required": `missing required phone field`})
})

const contactUpdateSchema = Joi.object({
  name: Joi.string().messages({ "any.required": `missing required name field`}),
  email: Joi.string().messages({ "any.required": `missing required email field`}),
  phone: Joi.string().min(3).max(10).messages({ "any.required": `missing required phone field`})
})

export default {
    contactAddSchema,
    contactUpdateSchema
}