const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const { host, port, user, pass } = require('../config/data-config.json');

const transport = nodemailer.createTransport({
    host : process.env.MAIL_HOST,
    port : process.env.MAIL_PORT,
    auth: {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./resources/mail'),
    extName: '.html'
}));

module.exports = transport;
