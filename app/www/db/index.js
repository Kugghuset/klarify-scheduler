'use strict';

'use strict';

var Mongoose = require('mongoose'),
    config   = require('config');


Mongoose.connect(config.dbs.mongodb.url);

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error' ));

db.once('open', function cb() {
    console.log("Connection with database succeeded.");
});

exports.mongoose = Mongoose;
exports.db = db;