import axios from "axios";

async function getChzzkApiResponse(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    return response.data.content;
  } catch (error) {
    console.error("API 호출 오류:", error.message);
    return { error: error.message };
  }
}
export default getChzzkApiResponse;
