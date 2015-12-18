var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema ({
    role                        : { type: Number, required: true },
    firstName                   : { type: String, required: true },
    lastName                    : { type: String, required: true },
    email                       : { type: String, required: true },
    password                    : { type: String, required: false }
});
UserSchema.indexes({ email: 1, unique: true });

//save User.
UserSchema.statics.saveUser = function(requestData, callback) {
    this.create(requestData, callback);
};

var user = mongoose.model('user', UserSchema);

/** export schema */
module.exports = {
    User : user
};
