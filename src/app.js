require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const xss = require('xss-clean');
const app = express();
const httpStatus = require('http-status');

const PORT = config.port;
const BASE_URL = config.baseUrl;

global.__basedir = __dirname;

const dir = path.join(__dirname, 'uploads');

app.use(xss());
app.use(
  cors({
    origin: '*',
  }),
);

app.use(
  '/uploads',
  express.static(dir, {
    maxAge: 2592000000,
  }),
);

const initRoutes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use('/api', initRoutes);

// Ignore all requests outside of mapped routes
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'error',
    message: 'File or route not found',
  });
});

app.listen(PORT, () => {
  console.log(`Running at ${BASE_URL}`);
});
