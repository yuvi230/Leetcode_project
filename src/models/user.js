const mongoose = require('mongoose');
const{ Schema } = mongoose;

const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: true,
        minLength: 2,
        maxLength: 20
    },
    lastName: { 
        type: String, 
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immuitable: true
    },
    age: {
        type: Number,
        min: 13,
        max: 80
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    problemSolved: {
        type: [String]
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    }
}, {
        timestamps: true
    
});
const User = mongoose.model("user", userSchema);
module.exports = User;