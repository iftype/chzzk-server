import PollingPolicy from "./PollingPolicy.js";
import crypto from "crypto";

class PollingProcessor {
  #channelService;
  #liveLogService;
  #videoMatchingService;

  constructor({ liveLogService, channelService, videoMatchingService }) {
    this.#liveLogService = liveLogService;
    this.#channelService = channelService;
    this.#videoMatchingService = videoMatchingService;
  }

  async processPollingChannel(channelId) {
    try {
      await this.#channelService.updateChannelState(channelId);
      return PollingPolicy.getChannelInterval();
    } catch (error) {
      console.error(`[processPollingChannel] 에러 발생 `, error.message);
      return PollingPolicy.getChannelInterval();
    }
  }

  async processPollingLiveLog(channelId) {
    try {
      await this.#liveLogService.initializeCache(channelId);

      const { isLive, closeDate } = await this.#liveLogService.processLiveLog(channelId);
      if (isLive) {
        return PollingPolicy.getOpenInterval();
      }
      return PollingPolicy.getCloseInterval(closeDate);
    } catch (error) {
      console.error(`[processPollingLiveLog] 에러 발생`, error.message);
      return PollingPolicy.getDefaultInterval();
    }
  }

  async processPollingVideoMatch(channelId) {
    try {
      const { matched } = await this.#videoMatchingService.matchAndSave(channelId);

      if (matched) {
        return PollingPolicy.getVideoSavedInterval();
      }
      return PollingPolicy.getVideoInterval();
    } catch (error) {
      console.error(`[processPollingVideo]`, error.message);
      return PollingPolicy.getVideoInterval();
    }
  }
}
export default PollingProcessor;
