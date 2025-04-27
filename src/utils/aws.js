import { NotificationManager } from "react-notifications";
import AWS from "aws-sdk";

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const uploadFile = async (file) => {
  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };
    await s3.putObject(params).promise();
    return true;
  } catch (e) {
    NotificationManager.error("could not upload file");
    console.error(e);
    return false;
  }
};

export const getFile = async (fileName) => {
  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      a,
    };
    const file = await s3.getObject(params).promise();
    return file
  } catch (e) {
    console.error(e);
    return false;
  }
};
