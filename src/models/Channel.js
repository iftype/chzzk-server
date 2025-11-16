class Channel {
  channelId;
  channelName;
  channelImageUrl;

  constructor({ channelId, channelName, channelImageUrl }) {
    this.channelId = channelId || null;
    this.channelName = channelName || null;
    this.channelImageUrl = channelImageUrl || null;
  }

  toDbData() {
    return {
      channelId: this.channelId,
      channelName: this.channelName,
      channelImageUrl: this.channelImageUrl,
    };
  }
}
export default Channel;
