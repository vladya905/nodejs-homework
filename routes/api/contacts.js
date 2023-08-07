import express from "express"
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js"
import contactsSchemas from "../../schemas/contacts-schemas.js";


const contactsAddValidate = validateBody(contactsSchemas.contactAddSchema);

const contactsUpdateValidate = validateBody(contactsSchemas.contactUpdateSchema);


const contactsRouter = express.Router()


contactsRouter.get("", contactsController.getAll);

contactsRouter.get('/:contactId', contactsController.getById);

contactsRouter.post('/', contactsAddValidate, contactsController.add);
  
contactsRouter.delete('/:contactId', contactsController.deleteById);

contactsRouter.put('/:contactId', contactsUpdateValidate, contactsController.updateById);

export default contactsRouter;
