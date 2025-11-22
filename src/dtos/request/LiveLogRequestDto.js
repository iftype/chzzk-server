class LiveLogRequestDto {
  #channelId;
  #date;

  constructor(req) {
    this.#channelId = req.params.channelId;
    this.#date = req.query.date || null;
  }

  get channelId() {
    return this.#channelId;
  }

  get date() {
    return this.#date;
  }

  get LiveLogInfo() {
    return {
      channelId: this.#channelId,
      date: this.#date,
    };
  }
}
export default LiveLogRequestDto;
