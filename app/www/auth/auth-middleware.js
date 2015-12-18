var passport = require('passport');

module.exports = function (req, res) {
    passport.authenticate(
        'jwt',
        { successRedirect: '/',
        failureRedirect: '/login',
        session: false})(req, res);
};
