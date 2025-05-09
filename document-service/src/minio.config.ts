import 'dotenv/config';
const AWS = require('aws-sdk');
const multerS3Transform = require('multer-s3-transform');
const multer = require('multer');

const {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_BUCKET,
  MINIO_REGION,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
} = process.env;

if (
  !MINIO_ENDPOINT ||
  !MINIO_BUCKET ||
  !MINIO_ACCESS_KEY ||
  !MINIO_SECRET_KEY
) {
  throw new Error('Missing MinIO env vars');
}

const s3 = new AWS.S3({
  endpoint: `${MINIO_ENDPOINT}:${MINIO_PORT ?? 9000}`,
  region: MINIO_REGION ?? 'us-east-1',
  accessKeyId: MINIO_ACCESS_KEY,
  secretAccessKey: MINIO_SECRET_KEY,
  s3ForcePathStyle: true, // indispensable avec MinIO
});

export const minioStorage = multerS3Transform({
  s3,
  bucket: MINIO_BUCKET,
  acl: 'private',
  contentType: (req, file, cb) => {
    cb(null, file.mimetype);
  },
  key: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const minioMulter = multer({ storage: minioStorage });