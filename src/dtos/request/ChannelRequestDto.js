import CHANNELS from "../../constants/channels.js";
class ChannelRequestDto {
  channelName;

  constructor(req) {
    this.channelName = req.params.channelName?.toUpperCase() || null;
  }

  get streamerId() {
    return CHANNELS[this.channelName];
  }
}
export default ChannelRequestDto;
