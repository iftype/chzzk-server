import ChannelRequestDto from "../dtos/request/ChannelRequestDto.js";

class ChannelController {
  #channelService;
  constructor({ channelService }) {
    this.#channelService = channelService;
  }

  // 채널 데이터 전부 가져오기
  async getChannelAllData(req, res) {
    const resDtoArray = await this.#channelService.responseChannelAll();
    res.status(200).json({ data: resDtoArray });
  }

  // 채널 데이터 하나만 가져오기
  async getChannelData(req, res) {
    const reqDto = new ChannelRequestDto(req);
    const { streamerId } = reqDto;
    console.log(streamerId);
    const resDto = await this.#channelService.responseChannel(streamerId);
    res.status(200).json({ channel: streamerId, data: resDto });
  }
}

export default ChannelController;
