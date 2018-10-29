const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const secret = process.env.APP_KEY; //require('../../config/data-config');

const router = express.Router();

//For Token generation
function tokenGenerator( params ) {
    return jwt.sign(params, secret, {
        expiresIn: 86400
    });
}

//For Registration User
router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if(await User.findOne({ email }))
            res.status(400).send({ error: true, msg: 'User already exists!' });

        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({ user, token: tokenGenerator({ id: user.id }) });

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Registration failed!', details: err });
    }
});

//For Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');

        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found!' });
        
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: true, msg: 'Invalid password!'});

        user.password = undefined;
        
        return res.send({ user, token: tokenGenerator({ id: user.id }) });

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Authentication failed!', details: err });
    }
});

//Forgot Password Resets
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found!' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        //Send Password Reset Email
        mailer.sendMail({
           to: email,
           from: 'admin@examplejwt.com.br',
           template: 'auth/forgot_password',
           context: { token } 
        }, (err) => {
            if(err)
                return res.status(400).send({ error: true, msg: 'Cannot send forgot password mail!', details: err });

            return res.send({ success: 'Email successfully sent, please check your inbox. Tank you!' })
        });      

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Error on forgot password, try again!', details: err });
    }
});

//Reset Password
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');
        
        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found!' });

        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: true, msg: 'Invalid Token!' });        
        
        if(new Date() > user.passwordResetExpires)
            return res.status(400).send({ error: true, msg: 'Token expired, please generate a new one!' });

        //Seccessful validation 
        user.password = password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        await user.save();

        return res.send({ success: 'Password reset success!' });
        
    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Error on reset password, try again', details: err });      
    }
});

module.exports = app => app.use('/auth', router);
