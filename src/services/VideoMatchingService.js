class VideoMatchingService {
  static VIEDO_MATCH_STAND = 24 * 60 * 60 * 1000;

  #liveLogService;
  #videoService;

  constructor({ liveLogService, videoService }) {
    this.#liveLogService = liveLogService;
    this.#videoService = videoService;
  }

  async matchAndSave(channelId) {
    const videoDto = await this.#videoService.getVideoFromApi(channelId);
    const lastLog = await this.#liveLogService.findLastLogByChannelId(channelId);

    if (!videoDto || !lastLog) {
      return { matched: false };
    }

    const { live_title, close_date, broadcast_session_id } = lastLog.toVideoMatch();
    const { videoTitle, publishDate } = videoDto.toDomainFields();

    const matchedTitle = live_title === videoTitle;
    const matchedDate =
      new Date(publishDate).getTime() - new Date(close_date).getTime() <
      VideoMatchingService.VIEDO_MATCH_STAND;

    console.log(live_title, close_date);
    if (!matchedTitle && !matchedDate) {
      return { matched: false };
    }

    const videoModel = await this.#videoService.insertVideo(videoDto);
    if (!videoModel) {
      return { matched: false };
    }
    const { videoPK } = videoModel;

    await this.#liveLogService.updateVideoIdBySessionId({
      sessionId: broadcast_session_id,
      videoPK,
    });
    return { matched: true };
  }
}

export default VideoMatchingService;
