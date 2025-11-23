import express from "express";
import cors from "cors";
import "dotenv/config";

import PostgreDB from "./config/PostgreDB.js";
import PollingProcessor from "./pollings/PollingProcessor.js";
import PollingScheduler from "./pollings/PollingScheduler.js";
import ChannelController from "./controllers/ChannelController.js";
import LiveLogController from "./controllers/LiveLogController.js";
import CategoryService from "./services/CategoryService.js";
import LiveLogService from "./services/LiveLogService.js";
import ChannelService from "./services/ChannelService.js";
import VideoService from "./services/VideoService.js";
import VideoMatchingService from "./services/VideoMatchingService.js";
import LiveLogRepository from "./repositories/LiveLogRepository.js";
import ChannelRepository from "./repositories/ChannelRepository.js";
import CategoryRepository from "./repositories/CategoryRepository.js";
import VideoRepository from "./repositories/VideoRepository.js";

class App {
  #app;
  #PORT;

  #pollingSchedulerInstance;

  #liveLogController;
  #channelController;

  constructor() {
    this.#app = express();
    this.#PORT = process.env.PORT || 8080;
    this.#initializeMiddlewares();
  }

  #initializeMiddlewares() {
    this.#app.use(cors());
  }

  #initializeRoutes() {
    // 채널 전부 가져오기
    this.#app.get(
      "/channel",
      this.#channelController.getChannelAllData.bind(this.#channelController)
    );

    // 특정 채널 정보 가져오기
    this.#app.get(
      "/channel/:channelId",
      this.#channelController.getChannelData.bind(this.#channelController)
    );

    // 특정 스트리머 기록 데이터 전부 가져오기
    this.#app.get(
      "/log/:channelId",
      this.#liveLogController.getLiveLogs.bind(this.#liveLogController)
    );

    this.#app.get("/", (req, res) => {
      res.send("서버 구동 중");
    });
  }

  #initializeErrorHandler() {
    this.#app.use((err, req, res, next) => {
      console.error("[Global Error]", err);
      const status = err.status || 500;
      const message = err.message || "서버 에러 발생";
      res.status(status).json({ error: message });
    });
  }

  async initializeDependencies() {
    const dbInstance = new PostgreDB();
    const pool = await dbInstance.initialize();

    const channelRepository = new ChannelRepository(pool);
    const liveLogRepository = new LiveLogRepository(pool);
    const categoryRepository = new CategoryRepository(pool);
    const videoRepository = new VideoRepository(pool);

    const channelService = new ChannelService({ channelRepository });
    const categoryService = new CategoryService({ categoryRepository });
    const liveLogService = new LiveLogService({
      channelService,
      categoryService,
      liveLogRepository,
    });
    const videoService = new VideoService({ channelService, videoRepository });
    const videoMatchingService = new VideoMatchingService({
      liveLogService,
      videoService,
    });

    this.#liveLogController = new LiveLogController({ liveLogService });
    this.#channelController = new ChannelController({ channelService });

    const processor = new PollingProcessor({
      liveLogService,
      channelService,
      videoMatchingService,
    });
    this.#pollingSchedulerInstance = new PollingScheduler({ processor });
  }

  async run() {
    await this.initializeDependencies();

    this.#initializeRoutes();
    this.#initializeErrorHandler();

    this.#pollingSchedulerInstance.run();

    this.#app.listen(this.#PORT, () => {
      console.log(`Server running http://localhost:${this.#PORT}`);
    });
  }
}

export default App;
