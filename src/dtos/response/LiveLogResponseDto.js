class LiveLogDetailResponseDto {
  constructor(model) {
    this.id = model.id;
    this.sessionId = model.sessionId;
    this.title = model.title;
    this.openDate = model.openDate?.toISOString() || null;
    this.closeDate = model.closeDate?.toISOString() || null;

    this.channel = {
      id: model.channel.id,
      streamerId: model.channel.streamerId,
      name: model.channel.name,
      imageUrl: model.channel.imageUrl,
    };

    this.video = {
      id: model.video.id,
      videoId: model.video.videoId,
      title: model.video.title,
      duration: model.video.duration,
    };

    this.category = {
      id: model.category.id,
      value: model.category.value,
      type: model.category.type,
      image: model.category.image,
    };
  }
}

export default LiveLogDetailResponseDto;
