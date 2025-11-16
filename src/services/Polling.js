import CHANNELS from "../constants/channels.js";

class Polling {
  defaultInterval;
  endedFastInterval;
  endedSlowInterval;
  maxEndedDuration;
  channelDuration;

  liveLogservice;
  channelService;
  timers = new Map();

  constructor({ liveLogService, channelService }) {
    this.liveLogService = liveLogService;
    this.channelService = channelService;

    // 카테고리 풀링
    this.defaultInterval = 1 * 60 * 1000; // 기본 1분
    this.endedFastInterval = 1 * 60 * 1000; // 종료 후 처음 10분: 1분
    this.endedSlowInterval = 5 * 60 * 1000; // 종료 10분~8시간: 5분
    this.maxEndedDuration = 8 * 60 * 60 * 1000; // 8시간

    // 채널 풀링
    this.channelDuration = 24 * 60 * 60 * 1000; // 24시간
  }

  run() {
    // Object.values(CHANNELS).forEach((channelId) => this.poolChannels(channelId));
    Object.values(CHANNELS).forEach((channelId) => this.poolLiveLogs(channelId));
  }

  async poolChannels(channelId) {
    try {
      await this.channelService.updateChannelState(channelId);
      this.#scheduleNext(channelId, this.channelDuration, this.poolChannels.bind(this));
    } catch (err) {
      console.error(`[Channel Polling] Error on ${channelId}:`, err.message);
      this.#scheduleNext(channelId, this.channelDuration, this.poolChannels.bind(this));
    }
  }

  async poolLiveLogs(channelId) {
    try {
      const pollingData = await this.liveLogservice.updateChannelStatus(channelId);
      const { status, closeDate } = pollingData;

      let nextInterval = this.defaultInterval;

      if (status === "CLOSE" && closeDate) {
        // closeDate를 Date 객체로 안전하게 변환
        const elapsed = Date.now() - closeDate.getTime();

        if (elapsed < 10 * 60 * 1000) {
          nextInterval = this.endedFastInterval; // 종료 후 10분까지: 1분
        } else if (elapsed < this.maxEndedDuration) {
          // 10분~8시간: 5분
          nextInterval = this.endedSlowInterval;
        } else {
          nextInterval = this.defaultInterval; // 8시간 이후: 기본 1분
        }
      }

      this.#scheduleNext(channelId, nextInterval, this.poolLiveLogs.bind(this));

      console.log(
        `[Polling] ${channelId} checked at ${new Date().toLocaleTimeString()} | status: ${status}`
      );
    } catch (err) {
      console.error(`[LiveLog Polling] Error on ${channelId}:`, err.message);
      // 에러 시에도 기본 1분 주기로 재시작
      this.#scheduleNext(channelId, this.defaultInterval, this.poolLiveLogs.bind(this));
    }
  }

  // 안전하게 다음 폴링 예약
  #scheduleNext(channelId, interval, fn) {
    if (!interval) return;
    if (this.timers.has(channelId)) clearTimeout(this.timers.get(channelId));
    const timerId = setTimeout(() => fn(channelId), interval);
    this.timers.set(channelId, timerId);
  }
}

export default Polling;
