import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

export async function uploadFile(file: File) {
  const s3 = new S3Client({
    endpoint: process.env.BUCKET_ENDPOINT, 
    region: "us-east-005", 
    credentials: {
      accessKeyId: process.env.BUCKET_KEY_ID!,
      secretAccessKey: process.env.B2_APPLICATION_KEY!,
    },
  });
  console.log(s3);

  try {
    const expiresIn = 7 * 24 * 60 * 60; // 3600
    const command = new PutObjectCommand({
      Bucket: "melsmellow",
      Key: file.name,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    const result = await axios.put(signedUrl, file);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
