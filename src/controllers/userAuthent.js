const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisclient = require('../config/redis');

const register = async (req, res) => {
    // Registration logic here
    try{
        validate(req.body);
        const { firstName, lastName, email, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body); 
        const token = jwt.sign({_id: user._id,email: user.email,role:'user'}, process.env.JWT_SECRET,{ expiresIn: '1h' });
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send({ message: "User registered successfully" });
    }
    catch(err){
        return res.status(400).send({ error: err.message });
    }
}

const login = async (req, res) => {
    // Login logic here
    try{
        const { email, password } = req.body;
        if(!email || !password){
            throw new Error("Email and Password are required");
        }
        const user =await User.findOne({ email });
        if(!user){
            throw new Error("Invalid credentials");
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign({_id: user._id,email: user.email,role:user.role}, process.env.JWT_SECRET,{ expiresIn: '1h' });
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(200).send({ message: "User logged in successfully" });
    }
    catch(err){
        return res.status(401).send({ error: err.message });
    }

}

const logout = async(req, res) => {
    // Logout logic here
    try{
        //valodate token from cookies
        const {token}= req.cookies;
        const payload = jwt.decode(token);
        await redisclient.set(`token:${token}`, 'blocked');
        await redisclient.expireAt(`token:${token}`, payload.exp);
        res.cookie("token",null,{expires :new Date(Date.now())});
        res.status(200).send({ message: "User logged out successfully" });
    }
    catch(err){
        res.status(500).send({ error: err.message });
    }
}

const adminRegister = async (req, res) => {
    try{
        validate(req.body);
        const { firstName, lastName, email, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const user = await User.create(req.body); 
        const token = jwt.sign({_id: user._id,email: user.email,role:'admin'}, process.env.JWT_SECRET,{ expiresIn: '1h' });
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send({ message: "Admin registered successfully" });
    }
    catch(err){
        return res.status(400).send({ error: err.message });
    }
}

module.exports = { register, login, logout, adminRegister };