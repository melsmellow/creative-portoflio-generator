import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiUrl, token, fileName } = await req.json();
    const response = await axios.post(
      `${apiUrl}/b2api/v2/b2_list_file_names`,
      {
        bucketId: process.env.B2_BUCKET_ID,
        startFileName: fileName,
        maxFileCount: 1,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return NextResponse.json({ token: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to get the list" },
      { status: 500 }
    );
  }
}
