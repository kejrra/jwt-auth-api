const mongoose = require('../../config/db-config');
//Lib para encriptar a senha
const bcrypt = require('bcryptjs');

//Cria o schema da collection
const UserSchema = new mongoose.Schema({

    //Atributos do meu Model/Collection
    username: {
        type: String, //Tipo do campo
        unique: true, //Define como campo unico na Collection
        lowercase: true, //Transforma toda a string em caixa baixa
        trim: true, //Retira espaços no incio e no fim da string
        required: true //Campo requerido
    },

    email: {
        type: String, //Tipo do campo
        unique: true, //Define como campo unico na Collection
        lowercase: true, //Transforma toda a string em caixa baixa
        trim: true, //Retira espaços no inicio e no fim da string
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], //verificação do formato do email
        required: true //Campo requerido
    },

    password: {
        type: String, //Tipo do campo
        select: false, //O campo não volta quando for feito uma busca
        required: true //Campo requerido
    },

    passwordResetToken: {
        type: String, //Tipo do campo
        select: false //O campo não volta quando for feito uma busca
    },

    passwordResetExpires: {
        type: Date, //Tipo do campo
        select: false //O campo não volta quando for feito uma busca
    },

    createdAt: {
        type: Date, //Tipo do campo
        default: Date.now //Define valor default para o campo
    }

});

//Ao salvar este procedimento, momentos antes faz a encriptação da senha em 15 passos
UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 15);

    this.password = hash;

    next();
});

//Cria e exporta a classe para ser usada no projeto
const User = mongoose.model('User', UserSchema);

module.exports = User;
