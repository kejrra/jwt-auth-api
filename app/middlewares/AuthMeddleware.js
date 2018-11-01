const jwt = require('jsonwebtoken');

const secret = process.env.APP_KEY;

module.exports = (req, res, next) => {
    //Pega o token do header da requisição
    const authHeader = req.headers.authorization;

    //Verifica se existe
    if(!authHeader)
        return res.status(401).send({ error: true, msg: 'Not Token provider!' });

    //Desmembra as partes por espaço, este é o formato:
    //Bearer <token>
    const parts = authHeader.split(' ');

    //Se tiver o tamanho diferente de 2 é um token inválido
    if(!parts.length === 2)
        return res.status(401).send({ error: true, msg: 'Invalid Token!' });

    //Separa as duas partes para verificação
    const [ scheme, token ] = parts;

    //Verifica se tem a palavra Bearer
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: true, msg: 'Token malformatted!' });

    //Por fim, autentica se estiver tudo certo
    jwt.verify(token, secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: true, msg: 'Invalid Token!', details: err });

        req.userId = decoded.id;
        //Este next() passa a aplicação para a proxima rota quando autenticado
        next();
    });

};
