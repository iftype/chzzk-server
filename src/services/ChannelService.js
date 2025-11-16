import getChzzkApiResponse from "../api/chzzk-Api.js";
import Channel from "../models/Channel.js";

class ChannelService {
  #API_BASE_URL = process.env.API_BASE_URL;
  #channelRepository;

  constructor({ channelRepository }) {
    this.#channelRepository = channelRepository;
  }

  // 컨트롤러에서 쓸 find 들

  // 다가져오기
  async getChannelAllData() {
    return this.#channelRepository.findAll();
  }
  async getChannelData(channelId) {
    return this.#channelRepository.findAll();
  }

  // polling 에서 쓸 거
  async updateChannelState(channelId) {
    // 방송 중 아니면 return
    const channelInstance = await this.#getChannel(channelId);
    if (!(channelInstance instanceof Channel)) {
      console.log(`[채널 서비스 Polling Error not instance of Channel]`);
      return;
    }
    const data = channelInstance.toDbData();
    console.log(data);
    this.#channelRepository.upsertChannel(data);
  }

  async #getChannel(channelId) {
    const apiUrl = `${this.#API_BASE_URL}/service/v1/channels/${channelId}`;
    console.log(`[서비스 풀링 요청]:  ${new Date().toLocaleTimeString()} 호출 `);

    const resContent = await getChzzkApiResponse(apiUrl);
    return new Channel(resContent);
  }
}
export default ChannelService;
