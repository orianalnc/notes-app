const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const {Schema} = mongoose;

const UserSchema= new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}


});

// Metodo para recibir una contraseña y cifrarla con bcrypt
UserSchema.methods.encryptPassword = async (password) => {
   const salt = await bcrypt.genSalt(10); //Generar un hash
   const hash = bcrypt.hash(password, salt); //Generar contraseña cifrada
   return hash;
};

//Comprueba la contraseña que introduce el usuario con la Base de datos
UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema)