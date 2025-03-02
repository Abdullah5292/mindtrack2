import { NotificationManager } from "react-notifications";
import AWS from "aws-sdk";

const S3_BUCKET = "mindtrack";
const REGION = "ap-south-1";

AWS.config.update({
  accessKeyId: "AKIAQS6GSQA2BPQVRHDA",
  secretAccessKey: "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",
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
