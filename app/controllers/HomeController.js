const express = require('express');
const authMeddleware = require('../middlewares/AuthMeddleware');

const router = express.Router();

//Faz com que todas as requisições desse controle passe pelo autenticador
router.use(authMeddleware);

router.get('/', (req, res) => {
    return res.send({ ok: true, msg: 'Home to JsonWebToken authentication API!', user_id: req.userId });
});

module.exports = app => app.use('/home', router);
