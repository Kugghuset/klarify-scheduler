var passport = require('passport');

module.exports = function (req, res, next) {
     passport
            .authenticate('jwt', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }, function(err, user, info) {
                if(err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ error: info });
                }

                req.user = user;
                return next();
            })(req, res, next);
};
