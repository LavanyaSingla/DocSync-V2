import jwt from 'jsonwebtoken';
import userModel from '../models/UserSchema/user.js';
import config from '../config/config.js';

const checkIsUserAuthenticated = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            //verify token
            const decoded = jwt.verify(token, config.SECRET_KEY);
            //get user from token
            req.user = await userModel.findById(decoded.userId).select("-password");
            next();
        }
        catch (err) {
            return res.status(400).json({ message: "unAuthorized user", err: err.message });
        }
    }
    else {
        return res.status(400).json({ message: "unAuthorized user" });
    }
};
export default checkIsUserAuthenticated;