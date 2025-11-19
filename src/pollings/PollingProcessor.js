import PollingPolicy from "./PollingPolicy.js";
import crypto from "crypto";

class PollingProcessor {
  static VIEDO_MATCH_STAND = 24 * 60 * 60 * 1000;
  #liveLogService;
  #channelService;
  #categoryService;
  #videoService;

  #cache; // 직전 카테고리랑비교용

  constructor({ liveLogService, categoryService, channelService, videoService }) {
    this.#liveLogService = liveLogService;
    this.#categoryService = categoryService;
    this.#channelService = channelService;
    this.#videoService = videoService;

    this.#cache = new Map();
  }
  // ChannelService 또는 PollingProcessor 초기화 로직 (의사 코드)

  async initializeCache(channelId) {
    const liveLogRow = await this.#liveLogService.findLastLiveBroadcast(channelId);
    if (!liveLogRow) return;
    const { live_category_id, broadcast_session_id } = liveLogRow;
    const { name } = await this.#categoryService.getCategoryByPK(live_category_id);
    this.#cache.set(channelId, {
      liveCategoryValue: name,
      sessionId: broadcast_session_id,
    });
  }

  async processPollingChannel(_channelId) {
    try {
      await this.#channelService.updateChannelState(_channelId);
      return PollingPolicy.getChannelInterval();
    } catch (error) {
      console.error(`[processPollingChannel] 에러 발생 `, error.message);
      return PollingPolicy.getOpenInterval();
    }
  }

  async processPollingLiveLog(_channelId) {
    try {
      const channelInstance = await this.#liveLogService.getLiveLogData(_channelId);
      if (!channelInstance) return PollingPolicy.getRetryInterval();
      const {
        channelId,
        liveTitle,
        openDate,
        closeDate,
        status,
        liveCategory,
        liveCategoryValue,
        categoryType,
      } = channelInstance.toDB();

      const cachedSession = this.#cache.get(_channelId);
      const categoryChanged =
        !cachedSession || cachedSession?.liveCategoryValue !== liveCategoryValue;

      const currentSessionId = this.#cache.has(_channelId)
        ? cachedSession.sessionId
        : crypto.randomUUID();

      if (status === "OPEN") {
        const channelIdKey = await this.#channelService.getOrCreateChannelId({ channelId });
        const categoryKey = await this.#categoryService.getOrCreateCategoryId({
          liveCategory,
          liveCategoryValue,
          categoryType,
        });
        if (!channelIdKey || !categoryKey) {
          return PollingPolicy.getRetryInterval();
        }

        if (categoryChanged) {
          await this.#liveLogService.saveChannelData({
            channelId: channelIdKey,
            sessionId: currentSessionId,
            liveTitle,
            openDate,
            closeDate,
            categoryId: categoryKey,
          });
          this.#cache.set(_channelId, {
            liveCategoryValue: liveCategory,
            sessionId: currentSessionId,
          });
        }
        return PollingPolicy.getOpenInterval();
      }
      // CLOSE
      this.#liveLogService.updateCloseDate({ sessionId: currentSessionId, closeDate });
      this.#cache.set(_channelId, null);
      return PollingPolicy.getCloseInterval(closeDate);
    } catch (error) {
      console.error(`[PollingProcesseorLiveLog] 에러 발생 `, error.message);
      return PollingPolicy.getOpenInterval();
    }
  }

  async processPollingVideo(_channelId) {
    try {
      // 최근 종료된 라이브로그 캐시 세션아이디를 가져오기
      const closeLivelog = await this.#liveLogService.findLastClosedLiveLogEmptyVideo(_channelId);
      if (!closeLivelog) {
        return PollingPolicy.getVideoInterval();
      }
      // 비디오 매칭 확인
      const videoInstance = await this.#videoService.getLastVideo(_channelId);
      const { live_title, close_date } = closeLivelog;
      const { title, publishDate } = videoInstance.toDB();
      const matchedTitle = live_title === title;
      const matchedDate =
        publishDate.getTime() - close_date.getTime() < PollingProcessor.VIEDO_MATCH_STAND;
      // 비디오 매칭 맞을 때
      if (matchedTitle && matchedDate) {
        // 비디오 저장
        const videoPK = await this.#videoService.insertVideo(videoInstance);
        const sessionId = closeLivelog.broadcast_session_id;
        await this.#liveLogService.updateVideoIdBySessionId({
          sessionId: sessionId,
          videoId: videoPK,
        });
        return PollingPolicy.getVideoSavedInterval();
      }
      return PollingPolicy.getVideoInterval();
    } catch (error) {
      console.error(`[processPollingVideo] 에러 발생 `, error.message);
      return PollingPolicy.getVideoInterval();
    }
  }
}
export default PollingProcessor;
