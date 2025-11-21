class Channel {
  #channelPK;
  #channelId;
  #channelName;
  #channelImageUrl;

  constructor({ channelPK = null, channelId, channelName, channelImageUrl }) {
    this.#channelPK = channelPK;
    this.#channelId = channelId;
    this.#channelName = channelName;
    this.#channelImageUrl = channelImageUrl;
  }

  get channelPK() {
    return this.#channelPK;
  }

  get channelId() {
    return this.#channelId;
  }

  toDB() {
    return {
      channel_id: this.#channelId,
      channel_name: this.#channelName,
      channel_image_url: this.#channelImageUrl,
    };
  }

  static fromDBRow(row) {
    if (!row) return null;
    return new Channel({
      channelPK: row.id,
      channelId: row.channel_id,
      channelName: row.channel_name,
      channelImageUrl: row.channel_image_url,
    });
  }

  toResponse() {
    return {
      channelId: this.#channelId,
      channelName: this.#channelName,
      channelImageUrl: this.#channelImageUrl,
    };
  }
}
export default Channel;
