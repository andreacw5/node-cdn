const express = require('express');
const router = express.Router();
const fileRoute = require('./route/file.route');
const uploadRoute = require('./route/upload.route');

const defaultRoutes = [
  {
    path: '/files',
    route: fileRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
