import LiveLogRequestDto from "../dtos/request/LiveLogRequestDto.js";
import LiveLogError from "../errors/LiveLogError.js";

class LiveLogController {
  #liveLogService;
  constructor({ liveLogService }) {
    this.#liveLogService = liveLogService;
  }

  async getLiveLogs(req, res) {
    const reqDto = new LiveLogRequestDto(req);
    const { streamerId, date } = reqDto;
    console.log(streamerId);
    if (date) {
      const resDto = await this.#liveLogService.resposeLiveLogDetailByDate({ streamerId, date });
      res.status(200).json({ data: resDto });
      return;
    }
    const resDto = await this.#liveLogService.resposeLiveLog({ streamerId });
    console.log(resDto);
    res.status(200).json({ data: resDto });
  }
}

export default LiveLogController;
