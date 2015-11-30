'use strict'

var express = require('express');
var controller = require('./endpoint.controller');

// Add auth middleware?

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;