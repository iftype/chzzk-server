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
    for (const channelId of Object.values(CHANNELS)) {
      this.scheduleChannels(channelId);
      this.scheduleLiveLogs(channelId);
      this.scheduleVideoMatch(channelId);
    }
  }

  async initializeCache() {
    const channelIds = Object.values(CHANNELS);
    for (const channelId of channelIds) {
      await this.#processor.processPollingChannel(channelId);
    }
  }

  async scheduleChannels(channelId) {
    await this.#schedulePolling(
      "channel",
      channelId,
      "processPollingChannel",
      this.scheduleChannels
    );
  }

  async scheduleLiveLogs(channelId) {
    await this.#schedulePolling("live", channelId, "processPollingLiveLog", this.scheduleLiveLogs);
  }

  async scheduleVideoMatch(channelId) {
    await this.#schedulePolling(
      "video",
      channelId,
      "processPollingVideoMatch",
      this.scheduleVideoMatch
    );
  }

  async #schedulePolling(type, channelId, processorMethod, scheduleMethod) {
    let nextInterval;
    const timerKey = `${type}_${channelId}`;
    const logPrefix = `[${type} Polling]`;

    try {
      const { interval } = await this.#processor[processorMethod](channelId);
      nextInterval = interval;
    } catch (err) {
      console.error(`${logPrefix} Error on ${channelId}:`, err.message);
      const { interval } = PollingPolicy.getDefaultInterval();
      nextInterval = interval;
    }
    this.#scheduleNext(timerKey, nextInterval, scheduleMethod.bind(this, channelId));
  }

  #scheduleNext(timerKey, interval, fn) {
    if (this.#timers.has(timerKey)) clearTimeout(this.#timers.get(timerKey));
    const timerId = setTimeout(fn, interval);
    this.#timers.set(timerKey, timerId);
  }
}
export default PollingScheduler;
