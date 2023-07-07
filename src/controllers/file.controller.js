const uploadFile = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const BASE_URL = config.baseUrl;

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    res.status(200).send({
      message: 'Uploaded the file successfully: ' + req.file,
    });
  } catch (err) {
    console.log(err);

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + '/uploads/';

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      });
    }

    const walk = function (dir, done) {
      let results = [];
      fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
          let file = list[i++];
          if (!file) return done(null, results);
          file = path.resolve(dir, file);
          fs.stat(file, function (err, stat) {
            if (stat && stat.isDirectory()) {
              walk(file, function (err, res) {
                results = results.concat(res);
                next();
              });
            } else {
              results.push({
                name: file,
                url: file.replace(__basedir, BASE_URL),
              });
              next();
            }
          });
        })();
      });
    };

    walk(directoryPath, function (err, results) {
      if (err) throw err;
      res.status(200).send(results);
    });
  });
};

const download = (req, res) => {
  const fileName = req.query.file;
  const directoryPath = __basedir + '/uploads/';

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Could not download the file. ' + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};
