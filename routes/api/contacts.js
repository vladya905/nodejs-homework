import express from "express"
import contactsService from "../../models/contacts.js"
import { HttpError } from "../../helpers/index.js";
import Joi from "joi";

const contactsRouter = express.Router()

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

contactsRouter.get("", async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error)
  }
    
});


contactsRouter.get('/:contactId', async(req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) { 
     throw HttpError(404)
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contactsService.addContact(req.body)
    res.status(201).json(result);
 } catch (error) {
   next(error)
  
 }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId)
     if (!result) {
    throw HttpError(404)
  }
    res.json({ message: "contact deleted" })
 } catch (error) {
  next(error)
 }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing fields")
    }
  const { contactId } = req.params;
  const result = await contactsService.updateContact(contactId, req.body)
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
  
} catch (error) {
  next(error)
}
})

export default contactsRouter;
