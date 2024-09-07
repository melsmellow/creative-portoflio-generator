import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await axios.post(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {},
      {
        auth: {
          username: process.env.BUCKET_KEY_ID!,
          password: process.env.B2_APPLICATION_KEY!,
        },
      }
    );

    return NextResponse.json(
      {
        apiUrl: response.data.apiUrl,
        token: response.data.authorizationToken,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "failed to upload" }, { status: 500 });
  }
}
