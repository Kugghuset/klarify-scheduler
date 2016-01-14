var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PresetSchema = new Schema ({
    name            : { type: String, required: true},
    value           : { type: String, required: true},
    userId          : { type: String, required: true },
    createdAt       : { type: Date, required: true, default: new Date() },
    updatedAt       : { type: Date, required: true, default: new Date() }
});

/** export schema */
module.exports = mongoose.model('presets', PresetSchema);
