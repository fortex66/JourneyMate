require("dotenv").config();
const multer = require('multer');
const Sequelize=require('sequelize');
const multerS3 = require('multer-s3');
const { S3 } = require('@aws-sdk/client-s3');

const s3 = new S3({
  credentials: {
      accessKeyId: process.env.AWS_ACCESSKEY,
      secretAccessKey: process.env.AWS_SECRETACCESSKEY
  },
  region: 'ap-northeast-2'
});
s3.listBuckets((err, data) => {
  if (err) {
      console.error("Error fetching bucket list:", err);
  } else {
      console.log("Buckets:", data.Buckets);
  }
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'journeymate',
      // acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `img/${Date.now()}-${file.originalname}`);
      },
    }),
  });
  const profile = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'journeymate',
      // acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `profileImage/${req.decode.userID}-${file.originalname}`);
      },
    }),
  });

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
  });

module.exports = {upload,profile, sequelize};