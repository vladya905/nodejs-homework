import User from "../models/user.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fs from "fs/promises";
import gravatar from "gravatar";
import path from 'path';
import jimp from "jimp";
import { nanoid } from "nanoid"

const {JWT_SECRET, BASE_URL} = process.env;



async function signup(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatar: avatarURL, verificationToken });
    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a href="${BASE_URL}api/auth/users/verify/${verificationToken}" target="blanc">click</a>`        
    }
    await sendEmail(verifyEmail);
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar
    });

};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    };
    if (!user.verify) {
        throw HttpError(401, "Email is not verify")
        
    }
    const passwordCompaire = await bcrypt.compare(password, user.password);
    if (!passwordCompaire) {
        throw HttpError(401, "Email or password is wrong")
    }
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token })
};

const getCurrent = (req, res) => {
    const { email, subscription, avatar } = req.user;
    res.json({
        email,
        subscription,
        avatar
    })
};

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {token: ""})
    res.status(204).json()
}

const avatarDir = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    
    const { path: avatar, filename } = req.file;
    const avatarName = `${_id}_${filename}`;
    const newPath = path.join(avatarDir, avatarName);
    const image = await jimp.read(avatar);
    await image.resize(250, 250).writeAsync(avatar);
    await fs.rename(avatar, newPath);
    const avatarURL = path.join("/avatars", avatarName);
    const user = await User.findById(_id);
    if (!user) {
        throw HttpError(401, "Not authorized");
    }
    user.avatar = avatarURL;
    await user.save();
    
    res.status(200).json({ avatarURL: user.avatar });
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken })
    
    if (!user) {
        throw HttpError(404, "User not found")
    }
   
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "null" })
    
    res.json({
        message: "Verification successful"
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(400, "missing required field email")
    };
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
        
    }
    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a href="${BASE_URL}api/auth/users/verify/${user.verificationToken}" target="blanc">click</a>`        
    }
    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email sent"
    })
}


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}
