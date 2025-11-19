import PollingPolicy from "./PollingPolicy.js";
import CHANNELS from "../constants/channels.js";

class PollingScheduler {
  #processor;
  #timers;

  constructor({ processor }) {
    this.#processor = processor;
    this.#timers = new Map();
  }

  async run() {
    await this.initializeCache();
    Object.values(CHANNELS).forEach((channelId) => this.scheduleChannels(channelId));
    Object.values(CHANNELS).forEach((channelId) => this.scheduleLiveLogs(channelId));
    Object.values(CHANNELS).forEach((channelId) => this.scheduleVieo(channelId));
  }

  async initializeCache() {
    const channelIds = Object.values(CHANNELS);
    for (const channelId of channelIds) {
      await this.#processor.processPollingChannel(channelId);
    }
    for (const channelId of channelIds) {
      await this.#processor.initializeCache(channelId);
    }
  }

  async scheduleChannels(channelId) {
    let nextInterval;
    let timerKey = `channel_${channelId}`;

    try {
      const { interval } = await this.#processor.processPollingChannel(channelId);
      nextInterval = interval;
    } catch (err) {
      console.error(`[Channel Polling] Error on ${channelId}:`, err.message);
      const { interval } = PollingPolicy.getDefaultInterval();
      nextInterval = interval;
    }
    this.#scheduleNext(timerKey, nextInterval, this.scheduleChannels.bind(this, channelId));
  }

  async scheduleLiveLogs(channelId) {
    let nextInterval;
    let timerKey = `live_${channelId}`;

    try {
      const { interval } = await this.#processor.processPollingLiveLog(channelId);
      nextInterval = interval;
    } catch (err) {
      console.error(`[LiveLog Polling] Error on ${channelId}:`, err.message);
      const { interval } = PollingPolicy.getDefaultInterval();
      nextInterval = interval;
    }
    this.#scheduleNext(timerKey, nextInterval, this.scheduleLiveLogs.bind(this, channelId));
  }

  async scheduleVieo(channelId) {
    let nextInterval;
    let timerKey = `video_${channelId}`;

    try {
      const { interval } = await this.#processor.processPollingVideo(channelId);
      nextInterval = interval;
    } catch (err) {
      console.error(`[LiveLog Polling] Error on ${channelId}:`, err.message);
      const { interval } = PollingPolicy.getDefaultInterval();
      nextInterval = interval;
    }
    this.#scheduleNext(timerKey, nextInterval, this.scheduleLiveLogs.bind(this, channelId));
  }

  #scheduleNext(timerKey, interval, fn) {
    if (this.#timers.has(timerKey)) clearTimeout(this.#timers.get(timerKey));
    const timerId = setTimeout(fn, interval);
    this.#timers.set(timerKey, timerId);
  }
}
export default PollingScheduler;
