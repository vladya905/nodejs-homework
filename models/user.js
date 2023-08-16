import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";
import { emailRegexp, subscription } from "../constans/user-constans.js";


const userSchema = new Schema({
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
 
  subscription: {
    type: String,
    enum: subscription,
    default: "starter"
  },
  avatar: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
token: String
}, { versionKey: false});

userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError)

const User = model("user", userSchema);

export default User