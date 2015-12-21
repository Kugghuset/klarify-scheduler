var passport = require('passport');

module.exports = function (req, res) {
    console.log('auth middleware');
    passport
        .authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }, function(err, user, info) {
            console.log('args', arguments);
        })(req, res);
};
