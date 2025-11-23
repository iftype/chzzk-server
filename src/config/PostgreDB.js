import pg from "pg";
class PostgreDB {
  #pool;

  #dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  async initialize() {
    try {
      this.#pool = new pg.Pool(this.#dbConfig);
      await this.#pool.query("SELECT NOW()");
      await this.#setupTable();
      return this.getPool();
    } catch (err) {
      console.error(err.message);
      throw new Error("데이터베이스 초기 연결에 실패했습니다.");
    }
  }

  async #setupTable() {
    if (!this.#pool) {
      console.error("pool 이 생성되지않았음");
      return;
    }

    try {
      // 1. CHANNELS
      await this.#pool.query(`
        CREATE TABLE IF NOT EXISTS CHZZK_CHANNELS (
          id SERIAL PRIMARY KEY,
          channel_id VARCHAR(100) NOT NULL UNIQUE,
          channel_name VARCHAR(100) NOT NULL,
          channel_image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. CHZZK_CATEGORIES
      await this.#pool.query(`
        CREATE TABLE IF NOT EXISTS CHZZK_CATEGORIES (
          id SERIAL PRIMARY KEY,
          category_id VARCHAR(100) UNIQUE NOT NULL,
          category_value TEXT NOT NULL,
          category_type VARCHAR(100) NOT NULL,
          category_image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. VIDEOS
      await this.#pool.query(`
        CREATE TABLE IF NOT EXISTS CHZZK_VIDEOS (
          id SERIAL PRIMARY KEY,
          video_no VARCHAR(100) NOT NULL UNIQUE,
          video_title TEXT,
          channel_pk INT REFERENCES CHZZK_CHANNELS(id),
          publish_date TIMESTAMP WITH TIME ZONE,
          video_thumbnail_url TEXT,
          video_duration INT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. CHZZK_LOGS
      await this.#pool.query(`
        CREATE TABLE IF NOT EXISTS CHZZK_LIVE_LOGS (
          id SERIAL PRIMARY KEY,
          channel_pk INT REFERENCES CHZZK_CHANNELS(id),
          live_session_id VARCHAR(50) NOT NULL,
          live_title TEXT,
          live_open_date TIMESTAMP WITH TIME ZONE,
          live_close_date TIMESTAMP WITH TIME ZONE,
          video_pk INT REFERENCES CHZZK_VIDEOS(id),
          category_pk INT REFERENCES CHZZK_CATEGORIES(id),
          log_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log("[DB] Tables created or verified successfully.");
    } catch (err) {
      console.error("[DB Error] Table creation failed:", err.message);
    }
  }

  getPool() {
    if (!this.#pool) {
      throw new Error(
        "DB 연결이 초기화되지 않았거나 실패했습니다. initialize()를 먼저 호출하세요."
      );
    }
    return this.#pool;
  }
}
export default PostgreDB;
