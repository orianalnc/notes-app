const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/User')

//Guardar los datos en una sesion 
//Autenticación local - Nueva estrategia de autenticación
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        //Callback DONE que termina el proceso de autenticación 
        return done(null, false, { message: 'Usuario no existe' });
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            //Retorna el email y contraseña correcta
            return done(null, user);
        } else {
            //Retorna si exixte el usuario pero la contraseña es incorrecta
            return done(null, false, { message: 'Contraseña incorrecta' })
        }
    }

}));

// Almacenar la sesion del usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
