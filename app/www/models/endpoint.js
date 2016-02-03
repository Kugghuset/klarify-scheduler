var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EndpointSchema = new Schema ({
    name            : { type: String, required: false },
    baseUrl         : { type: String, required: false },
    subDirectory    : { type: String, required: false },
    description     : { type: String, required: false },
    routes          : { type: Array, required: true },
    createdAt       : { type: Date, required: true, default: new Date() },
    updatedAt       : { type: Date, required: true, default: new Date() },
    isDisabled      : { type: Boolean, required: true }
});


/** export schema */
module.exports = mongoose.model('endpoint', EndpointSchema);
