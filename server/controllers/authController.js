import userModel from '../models/UserSchema/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import nodemailer from 'nodemailer';

class authController {
    static register = async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (username && email && password) {
                const isUser = await userModel.findOne({ email: email });
                if (isUser) {
                    return res.status(400).json({ message: "user already exists" });
                }
                else {
                    const gensalt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, gensalt);
                    const newUser = userModel({ username, email, password: hashedPassword });
                    const result = await newUser.save();
                    if (result) {
                        return res.status(201).json({ message: "user registered successfully" });
                    }
                    else {
                        return res.status(500).json({ message: "Internal server error" });
                    }
                }
            }
            else return res.status(400).json({ message: "All fields are required" });
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const isUser = await userModel.findOne({ email: email });
                if (isUser) {
                    if (await bcrypt.compare(password, isUser.password)) {
                        //generate token
                        const token = jwt.sign(
                            { userId: isUser._id },
                            config.SECRET_KEY,
                            { expiresIn: "2d" }
                        );

                        return res.status(200).json({ message: "User login successfully", token, data: isUser });
                    }
                    else {
                        return res.status(400).json({ message: "Invalid credentials" });
                    }
                }
                else {
                    return res.status(400).json({ message: "User not found" });
                }
            }
            else return res.status(400).json({ message: "All fields are required" });

        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
    static changePassword = async (req, res) => {
        try {
            const { newPassword, confirmPassword } = req.body;
            if (newPassword && confirmPassword) {
                if (newPassword === confirmPassword) {
                    const gensalt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(newPassword, gensalt);
                    await userModel.findByIdAndUpdate(req.user._id, {
                        password: hashedPassword
                    });
                    return res.status(200).json({ message: "Password changed successfully" })
                }
                else {
                    return res.status(400).json({ message: "Password does not match" })
                }
            }
            else {
                return res.status(400).json({ message: "All fields are required" })
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    };
    static resetPassword = async (req, res) => {
        try {
            const { email } = req.body;
            if (email) {
                const user = await userModel.findOne({ email });
                if (user) {
                    const secret_key = user._id + config.SECRET_KEY;
                    const token = jwt.sign({ userId: user._id }, secret_key, {
                        expiresIn: "1h"
                    });
                    const link = `http://localhost:3000/reset/${user._id}/${token}`;

                    const transort = nodemailer.createTransport({
                        service: "gmail",
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: config.EMAIL,
                            pass: config.EMAIL_PASSWORD
                        }
                    });
                    const mailOptions = {
                        from: config.EMAIL,
                        to: email,
                        subject: "Password Reset Request",
                        text:
                            `
                        <!doctype html>
                        <html lang ="en-US">
                        <head>
                        <meta content ="text/html; charset=utf-8" http-equiv="Content-Type" />
                        <title>Reset Password Email Template </title>
                        <meta name="description" content="Reset Password Email template.">
                        <style type="text/css">
                            a:hover{text-decoration:underline !important;}
                        </style>
                        </head>
                        <body>
                        <a href =${link}"> Reset Password </a>
                        </body>
                        </html>
                        `
                    };
                    transort.sendMail(mailOptions, (error, info) => {
                        if (error) return res.status(400).json({ message: "Error" });
                        return res.status(200).json({ message: "Email sent" });
                    });
                }
                else {
                    return res.status(400).json({ message: "email not found" });
                }
            }
            else {
                return res.status(400).json({ message: "email is required" });
            }
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: err.message });
        }
    };
    static resetPasswordEmail = async (req, res) => {
        const { newPassword, confirmPassword } = req.body.input;
        const { id, token } = req.params;
        try {
            if (newPassword && confirmPassword && id && token) {
                if (newPassword === confirmPassword) {
                    //token verify
                    const secret_key = id + config.SECRET_KEY;
                    try {
                        const isValid = jwt.verify(token, secret_key);
                        if (isValid) {
                            const isUser = await userModel.findById(id);
                            //password hashing
                            const genSalt = await bcrypt.genSalt(10);
                            const hashedPassword = await bcrypt.hash(newPassword, genSalt);

                            const result = await userModel.findByIdAndUpdate(isUser._id, { $set: { password: hashedPassword } });
                            if (result) {
                                return res.status(200).json({ message: "Password reset successfully" });
                            }
                            else {
                                return res.status(500).json({ message: "Error in re creating password" });
                            }
                        }
                        else {
                            return res.status(400).json({ message: "Link has been expired" });
                        }
                    }
                    catch (err) {
                        if (err.name === 'TokenExpiredError') {
                            return res.status(400).json({ message: "Link has expired, please request a new one" });
                        }
                        return res.status(400).json({ message: "Invalid token" });
                    }
                }
                else {
                    return res.status(400).json({ message: "Password does not match" });
                }
            }
            else {
                return res.status(400).json({ message: "All fields are required" });
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export default authController;

