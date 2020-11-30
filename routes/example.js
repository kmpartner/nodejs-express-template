const express = require('express');

const exampleController = require('../controllers/example');

const router = express.Router();

router.get('/', exampleController.exampleGet);

module.exports = router;