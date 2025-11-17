import LiveLog from "../models/LiveLog.js";
import getChzzkApiResponse from "../api/chzzk-Api.js";

class LiveLogService {
  #API_BASE_URL = process.env.API_BASE_URL;
  #liveLogRepository;
  #categoryService;
  #channelService;

  constructor({ liveLogRepository, categoryService, channelService }) {
    this.#liveLogRepository = liveLogRepository;
    this.#categoryService = categoryService;
    this.#channelService = channelService;
  }

  // 한 채널의 정보 전부 가져오기
  async getStoredChannelData(channelId) {
    return await this.#liveLogRepository.findAllByChannel(channelId);
  }

  // 현재 방송 중에서 가장 최근값 가져오기 캐시용
  async findLastLiveBroadcast(channelId) {
    const channelPK = await this.#channelService.getChannelId(channelId);
    return await this.#liveLogRepository.findLastLiveBroadcast({ channelId: channelPK });
  }

  // DB에 채널 데이터 저장하기
  async saveChannelData(channel) {
    await this.#liveLogRepository.save(channel);
  }

  // polling에서 사용
  async getLiveLogData(channelId) {
    const currentTimeHex = Date.now().toString(16);
    const dtValue = currentTimeHex.slice(-5);
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v3.2/channels/${channelId}/live-detail?dt=${dtValue}`;
    console.log(`[서비스 풀링 요청]:  ${new Date().toLocaleTimeString()} 호출 `);

    const resContent = await getChzzkApiResponse(apiUrl);
    const liveLogContent = LiveLog.fromApiContent(resContent);
    return new LiveLog(liveLogContent);
  }

  async updateCloseDate({ channelId, closeDate, openDate }) {
    const channelPK = await this.#channelService.getChannelId(channelId);
    this.#liveLogRepository.updateCloseDate({ channelPK, closeDate, openDate });
  }
}
export default LiveLogService;
