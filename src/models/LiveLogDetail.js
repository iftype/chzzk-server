class LiveLogDetail {
  constructor(data) {
    this.id = data.live_log_pk;
    this.sessionId = data.live_session_id;
    this.title = data.live_title;
    this.openDate = data.live_open_date;
    this.closeDate = data.live_close_date;
    this.logTime = data.log_time;

    this.channel = {
      id: data.channel_pk,
      streamerId: data.streamer_id,
      name: data.channel_name,
      imageUrl: data.channel_image_url,
    };

    this.video = {
      id: data.video_pk,
      videoId: data.video_id,
      title: data.video_title,
      thumbnailUrl: data.video_thumbnail_url,
      duration: data.video_duration,
    };

    this.category = {
      id: data.category_pk,
      categoryId: data.category_id,
      value: data.category_value,
      type: data.category_type,
      image: data.category_image_url,
    };
  }

  static fromDBRow(row) {
    return new LiveLogDetail(row);
  }
}
export default LiveLogDetail;
