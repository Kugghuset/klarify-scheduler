var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MethodSchema = new Schema ({
    name            : { type: String, required: false },
    type            : { type: String, required: true },
    url             : { type: String, required: true },
    code            : { type: String, required: true },
    parentId        : { type: String, required: true },
    userId          : { type: String, required: true },
    description     : { type: String, required: false },
    createdAt       : { type: Date, required: true, default: new Date },
    modifiedAt      : { type: Date,  required: true, default: new Date },
    disabled        : { type: Boolean, default: false }
});

MethodSchema.statics.clean = function(requestData, cb) {
    var method = requestData.toObject();
    delete method.__v;
    delete method.modifiedAt;
    delete method.createdAt;

    cb(method);

};

MethodSchema
    .indexes(
        {
            parentId: 1,
            unique: false
        },
        {
            type: 1,
            unique: false
        }
    );

/** export schema */
module.exports = mongoose.model('method', MethodSchema);
