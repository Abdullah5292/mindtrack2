import { NotificationManager } from "react-notifications";
import AWS from "aws-sdk";
import getConfig from "next/config";
import { v4 as uuidv4 } from "uuid";


const config = getConfig();
const S3_BUCKET = config.publicRuntimeConfig.awsS3Bucket;
const REGION = config.publicRuntimeConfig.awsRegion;

if (!S3_BUCKET || !REGION) {
  console.error("S3 Bucket or Region not defined");
}

AWS.config.update({
  accessKeyId: config.publicRuntimeConfig.awsAccessKey,
  secretAccessKey: config.publicRuntimeConfig.awsSecretKey,
});

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});


export const uploadFile = async (file) => {
  if (!file) {
    const errorMessage = "Invalid file: No file provided.";
    NotificationManager.error(errorMessage);
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  if (!S3_BUCKET) {
    const errorMessage = "S3 Bucket name is missing.";
    NotificationManager.error(errorMessage);
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  const fileName = uuidv4(); // Generate a unique file name
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file,
  };

  try {
    console.log(`Uploading file to S3: ${fileName}`);
    await s3.putObject(params).promise();
    console.log(`File uploaded successfully: ${fileName}`);
    return { success: true, fileName };
  } catch (error) {
    const errorMessage = `Error uploading file: ${error.message}`;
    NotificationManager.error(errorMessage);
    console.error(errorMessage, error);
    return { success: false, error: errorMessage };
  }
};


export const getFile = async (fileName) => {
  if (!fileName) {
    const errorMessage = "Invalid file name: No file name provided.";
    NotificationManager.error(errorMessage);
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  try {
    console.log(`Fetching file from S3: ${fileName}`);
    const file = await s3.getObject(params).promise();
    console.log(`File fetched successfully: ${fileName}`);

    // Return the file object with success flag
    return { success: true, file };
  } catch (error) {
    const errorMessage = `Error fetching file from S3: ${error.message}`;
    NotificationManager.error(errorMessage);
    console.error(errorMessage, error);

    // Return error details with failure flag
    return { success: false, error: errorMessage };
  }
};
