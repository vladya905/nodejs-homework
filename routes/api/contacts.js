import express from "express"
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js"
import contactsSchemas from "../../schemas/contacts-schemas.js";
import { isValidId, autenticate, upload} from "../../middleware/index.js";


 const contactsAddValidate = validateBody(contactsSchemas.contactAddSchema);

const contactsUpdateValidate = validateBody(contactsSchemas.contactUpdateSchema);
 
const contactsUpdateFavoriteValidate = validateBody(contactsSchemas.contactUpdateFavoriteSchema)


const contactsRouter = express.Router()

contactsRouter.use(autenticate);

contactsRouter.get("", contactsController.getAll);

contactsRouter.get('/:id', isValidId, contactsController.getById);

contactsRouter.post('/', upload.single("avatar"), contactsAddValidate, contactsController.add);
  
contactsRouter.delete('/:id', isValidId, contactsController.deleteById);

contactsRouter.put('/:id', isValidId, contactsUpdateValidate, contactsController.updateById);

contactsRouter.patch('/:id/favorite', isValidId,  contactsUpdateFavoriteValidate, contactsController.updateStatusContact)

export default contactsRouter;
