class ChannelRequestDto {
  #channelId;

  constructor(req) {
    this.#channelId = req.params.channelId || null;
  }

  get channelId() {
    return this.#channelId;
  }
}
export default ChannelRequestDto;
