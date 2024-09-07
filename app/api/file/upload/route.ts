import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Extract file and name from the FormData
  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  const fileName = formData.get("name") as string;

  if (!file || !fileName) {
    return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
  }

  const s3 = new S3Client({
    endpoint: "https://s3.us-east-005.backblazeb2.com",
    region: "us-east-005",
    credentials: {
      accessKeyId: process.env.BUCKET_KEY_ID!,
      secretAccessKey: process.env.B2_APPLICATION_KEY!,
    },
  });

  const expiresIn = 7 * 24 * 60 * 60;
  const command = new PutObjectCommand({
    Bucket: "creative-ui",
    Key: fileName,
    ContentType: file.type,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn });

  // Convert Blob to Buffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const result = await axios.put(signedUrl, fileBuffer, {
    headers: {
      "Content-Type": file.type,
    },
  });

  const url = result.request.res.responseUrl;
  const trimmedUrl = url.slice(0, url.indexOf("?"));

  if (result.status === 200) {
    return NextResponse.json(
      { data: { imageUrl: trimmedUrl } },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ message: "failed to upload" }, { status: 500 });
  }
}
