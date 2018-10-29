
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').load();

//Port on listening application
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.get('/', (req, res) => {
    res.send({ msg: 'Hello JsonWebToken Authentication API!' });
});

app.listen(PORT, () => {
    console.log('JWT-Auth-API listening on port: '+PORT+'!');
});
