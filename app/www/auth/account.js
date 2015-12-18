var User = require('../models/user');


exports.serializeUser = function(user, done) {
    done(null, user ? user.id : null);
};

exports.deserializeUser = function(id, done) {
    User.findOne({_id: id}, function(err, user) {
        done(err, user);
    });
};
