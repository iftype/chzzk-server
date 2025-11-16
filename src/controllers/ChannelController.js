import ChannelRequestDto from "../dtos/request/ChannelRequestDto.js";

class ChannelController {
  #channelService;
  constructor({ channelService }) {
    this.#channelService = channelService;
  }

  // 채널 데이터 전부 가져오기
  async getChannelAllData(req, res) {
    const content = await this.#channelService.getChannelAllData();
    res.status(200).json({ data: content });
  }

  // 채널 데이터 하나만 가져오기
  async getChannelData(req, res) {
    const reqDto = new ChannelRequestDto(req);
    const { streamerId } = reqDto;
    const content = await this.#channelService.getChannelData(streamerId);
    res.status(200).json({ channel: streamerId, data: content });
  }
}

export default ChannelController;
