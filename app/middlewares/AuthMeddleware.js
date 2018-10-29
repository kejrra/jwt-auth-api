const jwt = require('jsonwebtoken');
const { secret } = require('../../config/data-config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: true, msg: 'Not Token provider!' });

    const parts = authHeader.split(' ');
    
    if(!parts.length === 2)
        return res.status(401).send({ error: true, msg: 'Invalid Token!' }); 

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: true, msg: 'Token malformatted!' });

    jwt.verify(token, secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: true, msg: 'Invalid Token!' });

        req.userId = decoded.id;
        next();
    });

};
