import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";


const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner }).populate("owner", "email");
        res.json(result);
};

 const getById = async (req, res) => {
         const { id } = req.params;
     const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404)
         }
         res.json(result);
 };

const add = async (req, res) => {
     const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
        res.status(201).json(result);
 };

 const deleteById = async (req, res) => {
     const { id } = req.params;
     const result = await Contact.findByIdAndDelete(id)
     if (!result) {
         throw HttpError(404)
     }
     res.json({ message: "contact deleted" })
 }

 const updateById = async (req, res) => {
         const { id } = req.params;
         const result = await Contact.findByIdAndUpdate(id, req.body, {new: true})
         if (!result) {
             throw HttpError(404)
         }
         res.json(result)
};
 
const updateStatusContact = async(req, res) => {
    const { id } = req.params;
    if (req.body.favorite === undefined) {
        throw HttpError(400, "missing field favorite")
    }
         const result = await Contact.findByIdAndUpdate(id, req.body, {new: true})
         if (!result) {
             throw HttpError(404)
         }
         res.json(result)
};
 
export default {
     getAll : ctrlWrapper(getAll),
     getById: ctrlWrapper(getById),
     add: ctrlWrapper(add),
     deleteById: ctrlWrapper(deleteById),
     updateById: ctrlWrapper(updateById),
     updateStatusContact: ctrlWrapper(updateStatusContact)
}