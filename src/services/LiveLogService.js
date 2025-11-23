import LiveLog from "../models/LiveLog.js";
import ApiLiveLogDTO from "../dtos/api/ApiLiveLogDTO.js";
import getChzzkApiResponse from "../api/chzzk-Api.js";
import { generateSessionId } from "../utils/session.js";
import LiveLogDetailResponseDto from "../dtos/response/LiveLogDetailResponseDto.js";
import LiveLogRequestDto from "../dtos/request/LiveLogRequestDto.js";

class LiveLogService {
  #API_BASE_URL;
  #liveLogRepository;
  #channelService;
  #categoryService;
  #liveLogCache;

  constructor({ channelService, categoryService, liveLogRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;

    this.#channelService = channelService;
    this.#categoryService = categoryService;
    this.#liveLogRepository = liveLogRepository;
    this.#liveLogCache = new Map();
  }

  async getLiveLogFromApi(channelId) {
    const dtValue = Date.now().toString(16).slice(-5);
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v3.2/channels/${channelId}/live-detail?dt=${dtValue}`;
    const resContent = await getChzzkApiResponse(apiUrl);
    return new ApiLiveLogDTO(resContent);
  }

  async processLiveLog(channelId) {
    const liveLogDto = await this.getLiveLogFromApi(channelId);

    const logData = liveLogDto.toProcessLiveLogData();
    const { liveTitle, categoryId, categoryType, isLive, closeDate } = logData;
    const cachedLog = this.#liveLogCache.get(channelId);
    const sessionId = cachedLog ? cachedLog.liveSessionId : generateSessionId();

    const { categoryPK } = await this.#categoryService.getOrCreateCategoryPK({
      categoryId,
      categoryType,
    });

    const categoryChanged = categoryPK !== cachedLog?.categoryPK;
    const titleChanged = liveTitle !== cachedLog?.liveTitle;

    // 방송 종료일 때 처리
    if (!isLive && cachedLog) {
      const { liveSessionId } = cachedLog;
      await this.#liveLogRepository.updateSessionCloseDate({
        liveSessionId,
        closeDate,
      });
      this.#liveLogCache.set(channelId, null); // 캐시 클리어
      return { isLive, closeDate };
    }

    // 방송 종료인데 캐시도없으면 걍 넘어감
    if (!isLive && !cachedLog) {
      return { isLive };
    }

    if (categoryChanged || titleChanged) {
      await this.insertLiveLog(liveLogDto, sessionId);
      return { isLive, closeDate };
    }
    return { isLive };
  }

  async insertLiveLog(liveLogDto, sessionId) {
    const domainFields = liveLogDto.toDomainFields();

    const { channelId } = domainFields;
    const channel = await this.#channelService.getOrCreateChannelPK(channelId);
    const { channelPK } = channel;

    const { categoryId, categoryType } = domainFields;
    const { categoryPK } = await this.#categoryService.getOrCreateCategoryPK({
      categoryId,
      categoryType,
    });

    const targetLiveModel = new LiveLog({
      ...domainFields,
      liveSessionId: sessionId,
      channelPK,
      categoryPK,
    });
    const liveLogModel = await this.#liveLogRepository.save(targetLiveModel);

    if (liveLogModel) {
      this.#liveLogCache.set(channelId, liveLogModel.toCache());
      return liveLogModel;
    }
    return null;
  }

  async initializeCache(channelId) {
    const { channelPK } = await this.#channelService.getChannelPK(channelId);
    const logModel = await this.#liveLogRepository.findLastLiveLog({ channelPK });
    if (!logModel) return;
    this.#liveLogCache.set(channelId, logModel.toCache());
  }

  async findLastLogByChannelId(channelId) {
    const { channelPK } = await this.#channelService.getChannelPK(channelId);
    return await this.#liveLogRepository.findLastLiveLog({ channelPK });
  }

  async updateVideoPKBySessionId({ sessionId, videoPK }) {
    return await this.#liveLogRepository.updateVideoPKBySessionId({
      liveSessionId: sessionId,
      videoPK,
    });
  }

  async resposeLiveLog({ channelId }) {
    const { channelPK } = await this.#channelService.getChannelPK(channelId);
    const logDetailList = await this.#liveLogRepository.findLogDetailAllByPK({
      channelPK,
    });
    console.log(logDetailList);
    const responseDtoList = logDetailList.map((log) => new LiveLogDetailResponseDto(log));
    const groupedSessionsMap = new Map();
    responseDtoList.forEach((logDto) => {
      const sessionId = logDto.sessionId;
      if (!groupedSessionsMap.has(sessionId)) {
        groupedSessionsMap.set(sessionId, []);
      }
      groupedSessionsMap.get(sessionId).push(logDto);
    });

    const finalGroupedResult = Array.from(groupedSessionsMap.values());
    console.log(finalGroupedResult);
    return finalGroupedResult;
  }

  async resposeLiveLogDetailByDate({ channelId, date }) {
    const { channelPK } = await this.#channelService.getChannelPK(channelId);
    const logDetailList = await this.#liveLogRepository.findLogDetailListByDate({
      channelPK,
      date,
    });
    return logDetailList.map((log) => new LiveLogDetailResponseDto(log));
  }
}

export default LiveLogService;
