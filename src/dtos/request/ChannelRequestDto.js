import CHANNELS from "../../constants/channels.js";
class ChannelRequestDto {
  channelName;

  constructor(req) {
    this.channelName = req.params.channelName?.toUpperCase() || null;
  }

  get streamerId() {
    return { streamerId: CHANNELS[this.channelName] };
  }
}
export default ChannelRequestDto;
