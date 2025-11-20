import getChzzkApiResponse from "../api/chzzk-Api.js";
import Video from "../models/Video.js";
import ApiVideoDTO from "../dtos/api/ApiVideoDTO.js";

class VideoService {
  #API_BASE_URL;
  #channelService;
  #videoRepository;
  #videoPKCache;

  constructor({ channelService, videoRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;
    this.#channelService = channelService;
    this.#videoRepository = videoRepository;
    this.#videoPKCache = new Map();
  }

  async insertVideo(videoDto) {
    const videoData = videoDto.toDomainFields();
    const { channelId } = videoData;
    const { channelPK } = await this.#channelService.getChannelPK(channelId);

    const video = new Video({ ...videoData, channelPK });
    const updatedVideo = await this.#videoRepository.upsertVideo(video);
    if (updatedVideo) {
      const { videoId, videoPK } = updatedVideo;
      this.#videoPKCache.set(videoId, videoPK);
    }
    return updatedVideo;
  }

  async getVideoFromApi(channelId) {
    const apiUrl = `${
      this.#API_BASE_URL
    }/service/v1/channels/${channelId}/videos?sortType=LATEST&size=1`;
    const resContent = await getChzzkApiResponse(apiUrl);
    return new ApiVideoDTO(resContent);
  }
}

export default VideoService;
