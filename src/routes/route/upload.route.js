const express = require('express');
const uploadController = require('../../controllers/file.controller');

const router = express.Router();

router.route('/').post(uploadController.upload);

module.exports = router;
