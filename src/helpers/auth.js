const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('errors_msg', 'Aun no inicias sesión');
    res.redirect('/users/signin');

};

module.exports = helpers;