const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
require('../db.js');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,  // Username must be unique
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Regular expression to enforce the password constraints
                function validatePassword(password) {
                    // Check length
                    if (password.length < 8) {
                        return false; // Must be at least 8 characters long
                    }
                
                    // Check for at least one lowercase letter
                    if (!/[a-z]/.test(password)) {
                        return false; // Must contain at least one lowercase letter
                    }
                
                    // Check for at least one uppercase letter
                    if (!/[A-Z]/.test(password)) {
                        return false; // Must contain at least one uppercase letter
                    }
                
                    // Check for at least one digit
                    if (!/\d/.test(password)) {
                        return false; // Must contain at least one digit
                    }
                
                    // Check for at least one special character
                    if (!/[@$!%*?&]/.test(password)) {
                        return false; // Must contain at least one special character
                    }
                
                    return true; // All checks passed
                }
            },
            message: 'Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character'
        }
    },
    
   
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});


userSchema.methods.generateAuthToken = function() {

    const token = jsonwebtoken.sign({ _id: this._id,username:this.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;

}




module.exports = mongoose.model('User', userSchema);
