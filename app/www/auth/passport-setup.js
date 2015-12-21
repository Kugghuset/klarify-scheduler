var passport = require('passport'),
    JwtStrategy = require('passport-local').Strategy,
    Config = require('config');
var account = require('./account');
var User = require('../models/user');

module.exports = function (app) {

    var options = {
        secretOrKey: Config.appSecret
    };

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new JwtStrategy(options,
        function(username, password, done) {
            User.findOne({email: username}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                    // or you could create a new account
                }
            });
        }
    ));

    passport.serializeUser(account.serializeUser);
    passport.deserializeUser(account.deserializeUser);
};