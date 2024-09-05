import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

export async function uploadFile(file: File) {
  const s3 = new S3Client({
    endpoint: "https://s3.us-east-005.backblazeb2.com/test123411", // Your Backblaze B2 S3-compatible endpoint
    region: "us-east-005", // Your Backblaze B2 region
    credentials: {
      accessKeyId: "00503f44c8bf2aa0000000003",
      secretAccessKey: "K005Q6Owx23tXMFWdLlWpWUbHKFMcFU",
    },
  });
  console.log(s3);

  // Step 2: Upload the file
  try {
    const expiresIn = 7 * 24 * 60 * 60; // 3600
    const command = new PutObjectCommand({
      Bucket: "test123411",
      Key: file.name,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    const result = await axios.put(signedUrl, file);

    console.log(result);
    // const uploadResult = await s3.send(
    //   new PutObjectCommand({
    //     Bucket: "melsmellow", // Your Backblaze B2 bucket name
    //     Key: file.name, // The key (filename) under which the file will be stored in the bucket
    //     Body: file, // The file data
    //     ContentType: file.type, // The MIME type of the file
    //   })
    // );
    // console.log("Upload successful:", uploadResult);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
