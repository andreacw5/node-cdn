const express = require('express');
const fileController = require('../../controllers/file.controller');

const router = express.Router();

router.route('/').get(fileController.getListFiles);

router.route('/download').get(fileController.download);

module.exports = router;
