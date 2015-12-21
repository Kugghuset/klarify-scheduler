var passport        = require('passport'),
    JwtStrategy     = require('passport-jwt').Strategy,
    Config          = require('config'),
    account         = require('./account'),
    User            = require('../models/user');

module.exports = function (app) {

    var options = {
        secretOrKey: Config.appSecret,
        authScheme: 'Bearer'
    };

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new JwtStrategy(options,
        function(user, done) {
            User.findOne({_id: user.id}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (!user) {
                    return done(null, false, { message: 'Session expired.' });
                }

                return done(null, user);

            });
        }
    ));

    passport.serializeUser(account.serializeUser);
    passport.deserializeUser(account.deserializeUser);
};
