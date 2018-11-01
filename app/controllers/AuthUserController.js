const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const secret = process.env.APP_KEY;

const router = express.Router();

//Função para gerar o Token quando efetuar o login
function tokenGenerator( params ) {
    return jwt.sign(params, secret, {
        expiresIn: 86400
    });
}

//Rota para registrar usuário (se cadastrar)
router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        //Verifica e retorna se há um usuário cadastrado com o email informado
        if(await User.findOne({ email }))
            res.status(400).send({ error: true, msg: 'User already exists!' });

        //Efetua o cadastro do Usuário
        const user = await User.create(req.body);
        user.password = undefined;

        //Retorna o usuário e o token de login (Efetua o cadastro e o login)
        return res.send({ user, token: tokenGenerator({ id: user.id }) });

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Registration failed!', details: err });
    }
});

//Rota para efetuar o login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        //Procura o usuário na Collection pelo username
        const user = await User.findOne({ username }).select('+password');

        //Verifica se o usuário não foi encontrado
        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found!' });

        //Verifica se a senha está correta
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: true, msg: 'Invalid password!'});

        //Esconde a senha
        user.password = undefined;

        //Retorna o usuário e o token de autenticação
        return res.send({ user, token: tokenGenerator({ id: user.id }) });

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Authentication failed!', details: err });
    }
});

//Rota para resetar a senha
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        //Procura o usuário pelo email
        const user = await User.findOne({ email });

        //Verifica se o usuário existe
        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found!' });

        //Gera um token para validar a troca de senha
        const token = crypto.randomBytes(20).toString('hex');

        //Definição de prazo para a troca da senha
        const now = new Date();
        now.setHours(now.getHours() + 1);

        //Salva o token e o prazo no registro do usuário
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        //Envia o e-mail para o reset da senha
        mailer.sendMail({
           to: email,
           from: 'admin@examplejwt.com.br',
           template: 'auth/forgot_password',
           context: { token }
        }, (err) => {
            //Caso algum erro no envio do e-mail
            if(err)
                return res.status(400).send({ error: true, msg: 'Cannot send forgot password mail!', details: err });
            //Retorna se foi bem sucedido o envio do e-mail
            return res.send({ success: 'Email successfully sent, please check your inbox. Tank you!' })
        });

    } catch (err) {
        return res.status(400).send({ error: true, msg: 'Error on forgot password, try again!', details: err });
    }
});

//Rota que efetiva a troca da senha
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        //Busca o usuario pelo token
        const user = await User.findOne({ passwordResetToken: token })
            .select('+passwordResetToken passwordResetExpires');

        //Verifica se o usuário existe
        if(!user)
            return res.status(400).send({ error: true, msg: 'User not found for token resets!' });

        //Verifica se ainda é valido o token
        if(new Date() > user.passwordResetExpires)
            return res.status(400).send({ error: true, msg: 'Token expired, please generate a new one!' });

        //Aqui todas as verificações passaram com sucesso
        user.password = password; //Seta a nova senha
        user.passwordResetExpires = undefined; //Remove o campo
        user.passwordResetToken = undefined; //Remove o campo

        //Salva na collection com os dados atualizados
        await user.save();

        //Retorno de sucesso
        return res.send({ success: 'Password reset success!' });

    } catch (err) { //Erro no processo
        return res.status(400).send({ error: true, msg: 'Error on reset password, try again', details: err });
    }
});

//Exporta o controle com prefixo de rota "/auth"
module.exports = app => app.use('/auth', router);
