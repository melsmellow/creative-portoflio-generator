const axios = require("axios");

export async function getAuthorizationToken(){
  const response = await axios.post(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {},
    {
      auth: {
        username: process.env.BUCKET_KEY_ID,
        password: process.env.B2_APPLICATION_KEY,
      },
    }
  );
  return response.data.authorizationToken;
}
