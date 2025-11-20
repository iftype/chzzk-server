class PollingPolicy {
  static DEFAULT_INTERVAL = 1 * 60 * 1000;
  static CHANNEL_INTERVAL = 24 * 60 * 60 * 1000;
  static LIVE_OPEN_INTERVAL = 1 * 60 * 1000;
  static LIVE_CLOSE_INTERVAL = 5 * 60 * 1000;

  static VIDEO_INTERVAL = 10 * 60 * 1000;
  static VIDEO_SAVED_INTERVAL = 8 * 60 * 60 * 1000;

  static RESTART_STAND = 10 * 60 * 1000;
  static WAIT_LIVE_STAND = 8 * 60 * 60 * 1000;

  static getDefaultInterval() {
    return { interval: PollingPolicy.DEFAULT_INTERVAL };
  }

  static getChannelInterval() {
    return { interval: PollingPolicy.CHANNEL_INTERVAL };
  }

  static getRetryInterval() {
    return { interval: PollingPolicy.LIVE_OPEN_INTERVAL };
  }

  static getOpenInterval() {
    return { interval: PollingPolicy.LIVE_OPEN_INTERVAL };
  }

  static getVideoInterval() {
    return { interval: PollingPolicy.VIDEO_INTERVAL };
  }

  static getVideoSavedInterval() {
    return { interval: PollingPolicy.VIDEO_SAVED_INTERVAL };
  }

  static getCloseInterval(closeDate) {
    const time = Date.now() - new Date(closeDate).getTime();
    if (PollingPolicy.RESTART_STAND < time && time < PollingPolicy.WAIT_LIVE_STAND) {
      return { interval: PollingPolicy.LIVE_CLOSE_INTERVAL };
    }
    return { interval: PollingPolicy.LIVE_CLOSE_INTERVAL };
  }
}
export default PollingPolicy;
