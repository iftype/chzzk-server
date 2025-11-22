class LiveLogDetail {
  constructor(data) {
    this.sessionId = data.live_session_id;
    this.title = data.live_title;
    this.openDate = data.live_open_date;
    this.closeDate = data.live_close_date;
    this.logTime = data.log_time;

    this.channel = {
      channelId: data.streamer_id,
      channelName: data.channel_name,
      channelImageUrl: data.channel_image_url,
    };

    this.video = {
      videoNo: data.video_no,
      videoTitle: data.video_title,
      videoThumbnailUrl: data.video_thumbnail_url,
      videoDuration: data.video_duration,
    };

    this.category = {
      categoryId: data.category_id,
      categoryValue: data.category_value,
      categoryType: data.category_type,
      categoryImageUrl: data.category_image_url,
    };
  }

  static fromDBRow(row) {
    return new LiveLogDetail(row);
  }
}
export default LiveLogDetail;
