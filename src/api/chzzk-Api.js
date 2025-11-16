import axios from "axios";
import CHANNEL_MOCK_DATA from "../mock/channelMockData.js";

async function getChzzkApiResponse(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    console.log("💥API호출완료");
    // return CHANNEL_MOCK_DATA.content;
    return response.data.content;
  } catch (error) {
    console.error("API 호출 오류:", error.message);
    return { error: error.message };
  }
}
export default getChzzkApiResponse;
