var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResourceSchema = new Schema ({
    name            : { type: String, required: false },
    path            : { type: String, required: true },
    absolutePath    : {type: String, required: true},
    parentId        : {type: String, required: true},
    methods         : {type: Array, required: false},
    createdAt       : {type: Date, required: true, default: new Date},
    modifiedAt      : {type: Date,  required: true, default: new Date},
    disabled        : {type: Boolean, default: false},
    userId          : {type: String, required: true },
    level           : {type: Number, required: true},
    description     : {type: String, required: false}
});

ResourceSchema
    .indexes(
        {
            absolutePath: 1,
            unique: true
        }
    );

ResourceSchema
    .statics
    .createRoot = function () {
        var self = this;

        var payload = {
            path: '/',
            absolutePath: '/',
            userId: 'root',
            parentId: 'root',
            level: 0
        };

        self.findOne({level: 0}, function (err, exists) {
            if(exists) {
                return console.log('Root resource exists.');
            }
            self.create(payload, function (err, res) {
                if(err) {
                    return console.log('Error in creating root resource:', err);
                }

                console.log('Root resource created successfully.')
            });
        });
    };

/** export schema */
module.exports = mongoose.model('resource', ResourceSchema);
