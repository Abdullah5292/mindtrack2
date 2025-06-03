module.exports = {
  reactStrictMode: true,
  output: "standalone",
  publicRuntimeConfig: {
    backend: process.env.BACKEND,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    awsRegion: process.env.AWS_REGION,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
