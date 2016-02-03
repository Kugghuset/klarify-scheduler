var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema ({
    completeUrl     : { type: String, required: true },
    endpointId      : { type: String, required: true },
    requestType     : { type: String, required: true },
    userId          : { type: String, required: false },
    createdAt       : { type: Date, required: true, default: new Date() },
    updatedAt       : { type: Date, required: true, default: new Date() },
    isDisabled      : {type: Boolean, required: false}
});


/** export schema */
module.exports = mongoose.model('endpoint_logs', LogSchema);
