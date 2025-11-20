import express from "express";
import cors from "cors";
import "dotenv/config";

import LiveLogService from "./services/LiveLogService.js";
import LiveLogController from "./controllers/LiveLogController.js";
import LiveLogRepository from "./repositories/LiveLogRepository.js";
import PostgreDB from "./config/postgreDB.js";
import ChannelController from "./controllers/ChannelController.js";
import ChannelService from "./services/ChannelService.js";
import ChannelRepository from "./repositories/ChannelRepository.js";
import PollingProcessor from "./pollings/PollingProcessor.js";
import CategoryService from "./services/CategoryService.js";
import PollingScheduler from "./pollings/PollingScheduler.js";
import CategoryRepository from "./repositories/CategoryRepository.js";
import VideoService from "./services/VideoService.js";
import VideoRepository from "./repositories/VideoRepository.js";
import VideoMatchingService from "./services/VideoMatchingService.js";

class App {
  app;
  PORT;

  pollingSchedulerInstance;

  liveLogController;
  channelController;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 8080;
    this.#initializeMiddlewares();
  }

  #initializeMiddlewares() {
    this.app.use(cors());
  }

  #initializeRoutes() {
    // 특정 스트리머 채널 정보 가져오기
    this.app.get("/channel", this.channelController.getChannelAllData.bind(this.channelController));
    // 특정 스트리머 채널 정보 가져오기
    this.app.get(
      "/channel/:channelName",
      this.channelController.getChannelData.bind(this.channelController)
    );

    // // 특정 스트리머 라이브 데이터 전부 가져오기
    // this.app.get(
    //   "/live/:channelName",
    //   this.liveLogController.getLiveLogAllData.bind(this.liveLogController)
    // );

    // // 특정 스트리머 라이브 가져오기
    // this.app.get(
    //   "/live/:channelName/live",
    //   this.liveLogController.getLastLiveBroadcast.bind(this.liveLogController)
    // );

    // // 특정 스트리머 마지막 방송 가져오기
    // this.app.get("/channels/:channelId/last-ended", this.controller.getLastEndedBroadcast);
    // // 특정 스트리머의 카테고리들 가져오기
    // this.app.get("/channels/:channelId/categories", this.controller.getCategories);
    // // 특정 스트리머의 카테고리 리스트 가져오기
    // this.app.get("/channels/:channelId/category/:categoryValue", this.controller.getCategoryLogs);
    // // 특정 스트리머의 방송한 날짜 전부 가져오기
    // this.app.get("/channels/:channelId/date", this.controller.getDateLogs);
    // // 특정 스트리머의 날짜로 가져오기
    // this.app.get("/channels/:channelId/date/:date", this.controller.getDateLogs);

    this.app.get("/", (req, res) => {
      res.send("서버 구동 중");
    });
  }

  #initializeErrorHandler() {
    this.app.use((err, req, res, next) => {
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
    const videoService = new VideoService({ channelService, videoRepository });
    const liveLogService = new LiveLogService({
      channelService,
      categoryService,
      videoService,
      liveLogRepository,
    });
    const videoMatchingService = new VideoMatchingService({
      liveLogService,
      videoService,
    });

    this.liveLogController = new LiveLogController({ liveLogService });
    this.channelController = new ChannelController({ channelService });

    const processor = new PollingProcessor({
      liveLogService,
      channelService,
      videoMatchingService,
    });
    this.pollingSchedulerInstance = new PollingScheduler({ processor });
  }

  async run() {
    await this.initializeDependencies();

    this.#initializeRoutes();
    this.#initializeErrorHandler();

    this.pollingSchedulerInstance.run();

    this.app.listen(this.PORT, () => {
      console.log(`Server running http://localhost:${this.PORT}`);
    });
  }
}

export default App;
