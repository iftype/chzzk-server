import CHANNELS from "../../constants/channels.js";
class LiveLogRequestDto {
  #channelName;
  #date;

  constructor(req) {
    this.#channelName = req.params.channelName?.toUpperCase() || null;
    this.#date = req.query.date || null;
  }

  get streamerId() {
    return CHANNELS[this.#channelName];
  }

  get date() {
    return this.#date;
  }
}
export default LiveLogRequestDto;
