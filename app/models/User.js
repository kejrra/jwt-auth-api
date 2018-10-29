const mongoose = require('../../config/db-config');

const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    //Required attribute
    username: {
        type: String,
        unique: true,
        lowercase: true, 
        trim: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true
    },

    password: {
        type: String,
        select: false,
        required: true
    },

    passwordResetToken: {
        type: String,
        select: false
    },

    passwordResetExpires: {
        type: Date,
        select: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 15);

    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
