var express = require('express');
var router = express.Router();

const TEST = require("./test.js");

router.get('/',TEST.test);

module.exports = router;