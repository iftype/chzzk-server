import LiveLogRequestDto from "../dtos/request/LiveLogRequestDto.js";
import LiveLogError from "../errors/LiveLogError.js";

class LiveLogController {
  #liveLogService;
  constructor({ liveLogService }) {
    this.#liveLogService = liveLogService;
  }

  // 라이브 로그 전부 가져오기(날짜 기준)
  // todo: 10개씩만 가져와야하나?
  getLiveLogAllData = async (req, res) => {
    const reqDto = new LiveLogRequestDto(req);
    const { streamerId } = reqDto;
    const content = await this.#liveLogService.getStoredChannelData(streamerId);
    if (!content) {
      throw LiveLogError.NOT_FOUND();
    }
    res.status(200).json({ channel: streamerId, data: content });
  };

  async getStreamerAllData(req, res) {
    const requestedName = req.params.channelName.toUpperCase();
    const streamerId = CHANNELS[requestedName];
    const content = await this.#liveLogService.getAllByChannel(streamerId);
    if (!content) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다" });
    }
    res.status(200).json({ channel: requestedName, data: content });
  }

  async getLastBroadcast(req, res) {
    const log = await this.#liveLogService.getLastBroadcast(req.params.channelId);
    res.json(log);
  }

  async getLastLiveBroadcast(req, res) {
    const log = await this.#liveLogService.getLastLiveBroadcast(req.params.channelId);
    res.json(log);
  }

  async getLastEndedBroadcast(req, res) {
    const log = await this.#liveLogService.getLastEndedBroadcast(req.params.channelId);
    res.json(log);
  }

  async getCategories(req, res) {
    const categories = await this.#liveLogService.getCategoryList(req.params.channelId);
    res.json(categories);
  }

  async getCategoryLogs(req, res) {
    const logs = await this.#liveLogService.getByCategory(
      req.params.channelId,
      req.params.categoryValue
    );
    res.json(logs);
  }

  async getDateLogs(req, res) {
    const logs = await this.#liveLogService.getByDate(req.params.channelId, req.params.date);
    res.json(logs);
  }
}

export default LiveLogController;
