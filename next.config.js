module.exports = {
  reactStrictMode: true,
  output: "standalone",
  publicRuntimeConfig: {
    // backend: process.env.BACKEND,
    institution: process.env.INSTITUTION_SERVICE,
    user: process.env.USER_SERVICE,
    game: process.env.GAME_SERVICE,
    attempt: process.env.ATTEMPT_SERVICE,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    awsRegion: process.env.AWS_REGION,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
