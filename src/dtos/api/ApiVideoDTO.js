class ApiVideoDTO {
  #videoId;
  #videoTitle;
  #publishDate;
  #thumbnailImageUrl;
  #videoDuration;
  #channelId;

  constructor(apiContent) {
    if (!apiContent || !apiContent?.data[0] || !apiContent.data[0].channel) {
      return;
    }
    const videoData = apiContent.data[0];

    this.#videoId = videoData.videoId ?? null;
    this.#videoTitle = videoData.videoTitle ?? null;
    this.#publishDate = videoData.publishDate ?? null;
    this.#thumbnailImageUrl = videoData.thumbnailImageUrl ?? null;
    this.#videoDuration = videoData.duration ?? null;
    this.#channelId = videoData.channel.channelId;
  }

  toDomainFields() {
    return {
      videoId: this.#videoId,
      videoTitle: this.#videoTitle,
      publishDate: this.#publishDate,
      videoThumbnailUrl: this.#thumbnailImageUrl,
      videoDuration: this.#videoDuration,
      channelId: this.#channelId,
    };
  }
}
export default ApiVideoDTO;
