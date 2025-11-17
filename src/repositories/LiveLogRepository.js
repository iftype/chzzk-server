export default class LiveLogRepository {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  // 완성
  async save({ channelId, liveTitle, openDate, closeDate, categoryId }) {
    const sql = `
    INSERT INTO CHZZK_LOGS (channel_id, live_title, open_date, close_date, live_category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `;

    const binds = [channelId, liveTitle, openDate, closeDate, categoryId];
    try {
      const res = await this.pool.query(sql, binds);
      return res.rows[0];
    } catch (err) {
      console.error("[LiveLogRepository] 저장 실패", err.message);
      return null;
    }
  }

  // 방송 종료시 방송종료 필드 업데이트
  async updateCloseDate({ channelPK, closeDate, openDate }) {
    const sql = `
        UPDATE CHZZK_LOGS
        SET close_date = $1
        WHERE channel_id = $2
          AND open_date = $3
          AND close_date IS NULL
        RETURNING id;
    `;
    const binds = [closeDate, channelPK, openDate];
    try {
      const res = await this.pool.query(sql, binds);
      return (await res.rows[0]) || null;
    } catch (err) {
      return null;
    }
  }

  // 풀링에서 쓰는 거 / 현재 방송 중인 가장 최근 값 가져옴
  async findLastLiveBroadcast({ channelId }) {
    const sql = `
    SELECT *
    FROM CHZZK_LOGS
    WHERE channel_id = $1
      AND close_date IS NULL
    ORDER BY open_date DESC
    LIMIT 1
  `;
    try {
      const res = await this.pool.query(sql, [channelId]);
      return res.rows[0];
    } catch (err) {
      console.error("[ChannelRepository] findLastLiveBroadcast 실패:", err.message);
      return null;
    }
  }

  // 특정 채널 + 특정 날짜로 방송 찾기
  async findByChannelAndDate(channelId, date) {
    const sql = `
    SELECT *
    FROM CHZZK_LOGS
    WHERE channel_id = $1
      AND DATE(open_date) = $2
    ORDER BY open_date ASC
  `;
    const binds = [channelId, date];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows;
    } catch (err) {
      console.error("[ChannelRepository] findByChannelAndDate 실패:", err.message);
      return [];
    }
  }

  // 마지막 방송종료
  async findLastEndedBroadcast(channelId) {
    const sql = `
    SELECT *
    FROM CHZZK_LOGS
    WHERE channel_id = $1
      AND close_date IS NOT NULL
    ORDER BY close_date DESC
    LIMIT 1
  `;

    try {
      const result = await this.pool.query(sql, [channelId]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("[ChannelRepository] findLastEndedBroadcast 실패:", err.message);
      return null;
    }
  }
  // 특정 채널의 카테고리로 전부 가져오기
  async findByChannelAndCategory(channelId, categoryValue) {
    const sql = `
    SELECT *
    FROM CHZZK_LOGS
    WHERE channel_id = $1
      AND live_category_value = $2
    ORDER BY open_date DESC
  `;
    const binds = [channelId, categoryValue];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows;
    } catch (err) {
      console.error("[ChannelRepository] findByChannelAndCategory 실패:", err.message);
      return [];
    }
  }

  // 카테고리 리스트만 가져오기
  async findCategoryList(channelId) {
    const sql = `
    SELECT DISTINCT live_category_value
    FROM CHZZK_LOGS
    WHERE channel_id = $1
      AND live_category_value IS NOT NULL
    ORDER BY live_category_value ASC
  `;
    const binds = [channelId];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows.map((row) => row.live_category_value);
    } catch (err) {
      console.error("[ChannelRepository] findCategoryList 실패:", err.message);
      return [];
    }
  }

  // 한 채널의 정보 전부 다 가져오기
  async findAllByChannel(channelId) {
    const sql = `
    SELECT *
    FROM CHZZK_LOGS
    WHERE channel_id = $1
    ORDER BY open_date DESC
  `;
    const binds = [channelId];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows;
    } catch (err) {
      console.error("[ChannelRepository] findAllByChannel 실패:", err.message);
      return [];
    }
  }

  // 특정 스트리머의 방송한 날짜 리스트 가져오기
  async findBroadcastDates(channelId) {
    const sql = `
    SELECT DISTINCT DATE(open_date) AS broadcast_date
    FROM CHZZK_LOGS
    WHERE channel_id = $1
    ORDER BY broadcast_date ASC
  `;
    const binds = [channelId];

    try {
      const result = await this.pool.query(sql, binds);
      // broadcast_date만 배열로 반환
      return result.rows.map((row) => row.broadcast_date);
    } catch (err) {
      console.error("[ChannelRepository] findBroadcastDates 실패:", err.message);
      return [];
    }
  }

  // ChannelRepository.js
  // 특정 스트리머 마지막 방송 날짜 10개 가져오기
  async findLast10BroadcastDates(channelId, limit = 10) {
    const sql = `
    SELECT DISTINCT DATE(open_date) AS broadcast_date
    FROM CHZZK_LOGS
    WHERE channel_id = $1
    ORDER BY broadcast_date DESC
    LIMIT $2
  `;
    const binds = [channelId];

    try {
      const result = await this.pool.query(sql, binds);
      // broadcast_date 배열로 반환
      return result.rows.map((row) => row.broadcast_date);
    } catch (err) {
      console.error("[ChannelRepository] findLast10BroadcastDates 실패:", err.message);
      return [];
    }
  }
}
