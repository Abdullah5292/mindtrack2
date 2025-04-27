import { NotificationManager } from "react-notifications";
import AWS from "aws-sdk";

const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
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
    // Convert the buffer to a base64 string
    const base64Image = file.Body.toString('base64');

    // Return the base64-encoded image data (you may want to determine the MIME type dynamically)
    const imageSrc = `data:image/jpeg;base64,${base64Image}`; // Change 'image/jpeg' if necessary (e.g., 'image/png')
    return imageSrc;
  } catch (e) {
    console.error("S3 getObject error:", e);
    return false;
  }
};
