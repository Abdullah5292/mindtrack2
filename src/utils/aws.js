import { NotificationManager } from "react-notifications";
import AWS from "aws-sdk";
import getConfig from "next/config";
import { v4 as uuidv4 } from "uuid";

const config = getConfig();

const S3_BUCKET = config.publicRuntimeConfig.awsS3Bucket;
const REGION = config.publicRuntimeConfig.awsRegion;

AWS.config.update({
  accessKeyId: config.publicRuntimeConfig.awsAccessKey,
  secretAccessKey: config.publicRuntimeConfig.awsSecretKey,
});

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const uploadFile = async (file) => {
  try {
    if (!file) throw new Error("invalid file");
    const fileName = uuidv4();
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: file,
    };
    await s3.putObject(params).promise();
    return fileName;
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
    };
    const file = await s3.getObject(params).promise();
    if (!file) return null;
    // Convert the buffer to a base64 string
    const base64Image = file.Body.toString("base64");

    // Return the base64-encoded image data (you may want to determine the MIME type dynamically)
    const imageSrc = `data:image/jpeg;base64,${base64Image}`; // Change 'image/jpeg' if necessary (e.g., 'image/png')
    return imageSrc;
  } catch (e) {
    console.error("S3 getObject error:", e);
    return false;
  }
};
