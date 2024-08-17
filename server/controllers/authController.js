import userModel from '../models/UserSchema/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

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
            console.log(req);
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

                        return res.status(200).json({ message: "User login successfully", token });
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
            console.log(err.message);
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
                console.log(req.body);
                return res.status(400).json({ message: "All fields are required" })
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export default authController;

