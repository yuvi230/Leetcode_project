const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisclient = require('../config/redis');

const userMiddleware = async(req, res, next) => {
    try {
        const {token}= req.cookies;
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = payload;
        if (!_id) {
            throw new Error("Invalid token payload");
        }
        const result = await User.findById(_id);
        if (!result) {
            throw new Error("User not found");
        }
        // redis ke blocklist mei present toh nahi hai
        const isBlocked = await redisclient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Invalid token");
        }
        req.user = result;
        next();
    } catch (err) {
        return res.status(401).send({ error: err.message });
    }
}
module.exports = userMiddleware;