import LiveLogRequestDto from "../dtos/request/LiveLogRequestDto.js";

class LiveLogController {
  #liveLogService;

  constructor({ liveLogService }) {
    this.#liveLogService = liveLogService;
  }

  async getLiveLogs(req, res) {
    const reqDto = new LiveLogRequestDto(req);
    const { channelId, date } = reqDto.LiveLogInfo;
    if (date) {
      const resDto = await this.#liveLogService.resposeLiveLogDetailByDate({ channelId, date });
      res.status(200).json({ data: resDto });
      return;
    }
    const resDto = await this.#liveLogService.resposeLiveLog({ channelId });
    res.status(200).json({ data: resDto });
  }
}

export default LiveLogController;
