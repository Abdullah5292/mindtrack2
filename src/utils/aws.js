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
