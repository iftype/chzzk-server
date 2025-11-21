class ChannelResponseDto {
  #channelId;
  #channelName;
  #channelImageUrl;

  constructor(channelId, channelName, channelImageUrl) {
    this.#channelId = channelId;
    this.#channelName = channelName;
    this.#channelImageUrl = channelImageUrl;
  }

  toJSON() {
    return {
      channelId: this.#channelId,
      channelName: this.#channelName,
      channelImageUrl: this.#channelImageUrl,
    };
  }
}
export default ChannelResponseDto;
