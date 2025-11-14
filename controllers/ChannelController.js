import CHANNELS from "../constants/channels.js";

class ChannelController {
  #channelService;
  constructor({ channelService }) {
    this.#channelService = channelService;
  }

  getStreamerData = async (req, res) => {
    try {
      const requestedName = req.params.channelName.toUpperCase();
      const streamerId = CHANNELS[requestedName];
      const content = await this.#channelService.getStoredChannelData(streamerId);
      if (!content) {
        return res.status(404).json({ message: "데이터를 찾을 수 없습니다" });
      }
      res.status(200).json({ channel: requestedName, data: content });
    } catch (error) {
      console.error("스트리머 조회 중 에러 발생:", error);
      res.status(500).json({ error: "에러 발생" });
    }
  };
}

export default ChannelController;
