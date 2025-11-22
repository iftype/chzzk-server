class LiveLogDetailResponseDto {
  constructor(model) {
    this.id = model.id;
    this.sessionId = model.sessionId;
    this.title = model.title;
    this.openDate = model.openDate?.toISOString() || null;
    this.closeDate = model.closeDate?.toISOString() || null;

    this.channel = {
      channelId: model.channel.channelId,
      channelName: model.channel.channelName,
      channelImageUrl: model.channel.channelImageUrl,
    };

    this.video = {
      videoNo: model.video.videoNo,
      videoTitle: model.video.videoTitle,
      videoThumbnailUrl: model.video.videoThumbnailUrl,
      videoDuration: model.video.videoDuration,
    };

    this.category = {
      categoryId: model.category.categoryId,
      categoryValue: model.category.categoryValue,
      categoryType: model.category.categoryType,
      categoryImageUrl: model.category.categoryImageUrl,
    };
  }
}

export default LiveLogDetailResponseDto;
