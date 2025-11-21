import axios from "axios";
import CHANNEL_MOCK_DATA from "../mock/channelMockData.js";
import LIVELOG_MOCK_DATA from "../mock/liveLogMockData.js";

async function getChzzkApiResponse(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    // return CHANNEL_MOCK_DATA.content;
    // return LIVELOG_MOCK_DATA.content;
    return response.data.content;
  } catch (error) {
    console.error("API 호출 오류:", error.message);
    return { error: error.message };
  }
}
export default getChzzkApiResponse;
