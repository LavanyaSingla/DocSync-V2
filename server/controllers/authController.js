const User = require('../models/UserSchema/user.js');
const Role = require('../models/UserSchema/role.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

exports.signUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const roleDocument = await Role.findOne({ type: role });

        if (!roleDocument) {
            return res.status(400).json({ "Message": "Invalid role" });
        }

        const user = new User({
            username,
            email,
            role: roleDocument._id,
            password: bcrypt.hashSync(password, 8)
        });

        await user.save();

        res.status(200).json({ "Message": "User signup successfully!", "data": user });
    } catch (err) {
        res.status(500).json({ "Message": err.message });
    }
};

exports.signIn = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).populate('role');

        if (!user) {
            return res.status(400).json({ "Message": "User not found." });
        }

        const validatePassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validatePassword) {
            return res.status(401).json({ "Message": "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 8000
        });

        req.session.token = token;
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role.type
        });
    } catch (err) {
        res.status(500).json({ "Message": err.message });
    }
};

exports.signOut = async (req, res) => {
    try {
        req.session = null;
        res.status(200).json({ "Message": "You've been signed out successfully!" });
    } catch (err) {
        res.status(500).json({ "Message": err.message });
    }
};
