var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema ({
    role                        : { type: Number, required: true },
    firstName                   : { type: String, required: true },
    lastName                    : { type: String, required: true },
    email                       : { type: String, required: true },
    password                    : { type: String, required: true },
    createdAt                   : { type: Date, required: true}
});

UserSchema.indexes({ email: 1, unique: true });

//save User.
UserSchema.statics.register = function(requestData, callback) {
    this.create(requestData, callback);
};

UserSchema.statics.clean = function(requestData, cb) {
    var user = requestData.toObject();
    delete user.__v;
    delete user.password;
    delete user.createdAt;

    cb(user);

};


/** export schema */
module.exports = mongoose.model('user', UserSchema);
