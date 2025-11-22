import LiveLog from "../models/LiveLog.js";
import LiveLogDetail from "../models/LiveLogDetail.js";

export default class LiveLogRepository {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  async save(liveLog) {
    const dbData = liveLog.toDB();
    const sql = `
            INSERT INTO CHZZK_LIVE_LOGS 
                (channel_pk, live_session_id, live_open_date, live_title, live_close_date, video_pk, category_pk)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
    const binds = [
      dbData.channel_pk,
      dbData.live_session_id,
      dbData.live_open_date,
      dbData.live_title,
      dbData.live_close_date,
      dbData.video_pk,
      dbData.category_pk,
    ];
    try {
      const res = await this.pool.query(sql, binds);
      return res.rows[0] ? LiveLog.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[LiveLogRepository] upsertLog 실패:", err.message);
      return null;
    }
  }

  async updateSessionCloseDate({ liveSessionId, closeDate }) {
    const sql = `
            UPDATE CHZZK_LIVE_LOGS
            SET live_close_date = $1
            WHERE live_session_id = $2 
              AND live_close_date IS NULL  
            RETURNING id;
        `;
    const binds = [closeDate, liveSessionId];

    try {
      const res = await this.pool.query(sql, binds);
      return res.rows[0] ? LiveLog.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[LiveLogRepository] updateCloseDate 실패:", err.message);
      return 0;
    }
  }

  async findLastLiveLog({ channelPK }) {
    const sql = `
            SELECT *
            FROM CHZZK_LIVE_LOGS
            WHERE channel_pk = $1
              AND video_pk IS NULL
            ORDER BY log_time DESC
            LIMIT 1
        `;
    try {
      const res = await this.pool.query(sql, [channelPK]);
      return res.rows[0] ? LiveLog.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[LiveLogRepo] findLastLiveLog 실패:", err.message);
      return null;
    }
  }

  async findByChannelAndDate(channelPK, date) {
    const sql = `
            SELECT *
            FROM CHZZK_LIVE_LOGS
            WHERE channel_pk = $1
              AND DATE(live_open_date) = $2
            ORDER BY live_open_date ASC
        `;
    const binds = [channelPK, date];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows.map((row) => LiveLog.fromDBRow(row));
    } catch (err) {
      console.error("[LiveLogRepository] findByChannelAndDate 실패:", err.message);
      return [];
    }
  }

  async findLastClosedLiveLogEmptyVideo({ channelPK }) {
    const sql = `
            SELECT *
            FROM CHZZK_LIVE_LOGS
            WHERE channel_pk = $1
              AND live_close_date IS NOT NULL
              AND video_pk IS NULL
            ORDER BY live_close_date DESC
            LIMIT 1
        `;
    try {
      const result = await this.pool.query(sql, [channelPK]);
      return result.rows[0] ? LiveLog.fromDBRow(result.rows[0]) : null;
    } catch (err) {
      console.error("[LiveLogRepository] findLastClosedLiveLogEmptyVideo 실패:", err.message);
      return null;
    }
  }

  async findLiveLogsBySessionId({ liveSessionId }) {
    const sql = `
            SELECT *
            FROM CHZZK_LIVE_LOGS
            WHERE 
                live_session_id = $1;
        `;
    try {
      const result = await this.pool.query(sql, [liveSessionId]);
      return result.rows[0] ? LiveLog.fromDBRow(result.rows[0]) : null;
    } catch (err) {
      console.error("[LiveLogRepository] findLiveLogsBySessionId 실패:", err.message);
      return null;
    }
  }

  async updateVideoIdBySessionId({ liveSessionId, videoPK }) {
    const sql = `
            UPDATE CHZZK_LIVE_LOGS
            SET video_pk = $1
            WHERE live_session_id = $2;
        `;
    try {
      const result = await this.pool.query(sql, [videoPK, liveSessionId]);
      return result.rowCount || 0;
    } catch (err) {
      console.error("[LiveLogRepository] updateVideoIdBySessionId 실패:", err.message);
      return 0;
    }
  }

  async findLogDetailListByDate({ channelPK, date }) {
    const sql = `
    SELECT
        L.id AS live_log_pk,
        L.live_session_id,
        L.live_title,
        L.live_open_date,
        L.live_close_date,
        L.log_time,

        C.id AS channel_pk,
        C.channel_id AS streamer_id,
        C.channel_name,
        C.channel_image_url,

        V.id AS video_pk,
        V.video_id,
        V.video_title,
        V.video_thumbnail_url,
        V.video_duration,

        G.id AS category_pk,
        G.category_id,
        G.category_value,
        G.category_type,
        G.category_image_url
    FROM
        CHZZK_LIVE_LOGS L
    INNER JOIN CHZZK_CHANNELS C ON L.channel_pk = C.id
    INNER JOIN CHZZK_VIDEOS V ON L.video_pk = V.id
    INNER JOIN CHZZK_CATEGORIES G ON L.category_pk = G.id
    WHERE
        L.channel_pk = $1
    AND DATE(L.live_open_date) = $2
    ORDER BY
        L.log_time ASC;
    `;
    const binds = [channelPK, date];
    try {
      const result = await this.pool.query(sql, binds);
      return result.rows.map((row) => LiveLogDetail.fromDBRow(row));
    } catch (err) {
      console.error("[LiveLogRepository] findLogDetailListByDate 실패:", err.message);
      return [];
    }
  }

  async findLogByPK({ channelPK }) {
    const sql = `
    SELECT
        L.id AS live_log_pk,
        L.live_session_id,
        L.live_title,
        L.live_open_date,
        L.live_close_date,
        L.log_time,

        C.id AS channel_pk,
        C.channel_id AS streamer_id,
        C.channel_name,
        C.channel_image_url,

        V.id AS video_pk,
        V.video_id,
        V.video_title,
        V.video_thumbnail_url,
        V.video_duration,

        G.id AS category_pk,
        G.category_id,
        G.category_value,
        G.category_type,
        G.category_image_url
    FROM
        CHZZK_LIVE_LOGS L
    INNER JOIN CHZZK_CHANNELS C ON L.channel_pk = C.id
    LEFT  JOIN CHZZK_VIDEOS V ON L.video_pk = V.id
    LEFT  JOIN CHZZK_CATEGORIES G ON L.category_pk = G.id
    WHERE
        L.channel_pk = $1
    ORDER BY log_time DESC
    `;
    const binds = [channelPK];
    try {
      const result = await this.pool.query(sql, binds);
      console.log(result.rows);
      return result.rows.map((row) => LiveLogDetail.fromDBRow(row));
    } catch (err) {
      console.error("[LiveLogRepository] findLogDetailListByDate 실패:", err.message);
      return [];
    }
  }

  async findLiveDates(channelPK) {
    const sql = `
            SELECT DISTINCT DATE(live_open_date) AS broadcast_date
            FROM CHZZK_LIVE_LOGS
            WHERE channel_pk = $1
            ORDER BY broadcast_date ASC
        `;
    const binds = [channelPK];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows.map((row) => row.broadcast_date);
    } catch (err) {
      console.error("[LiveLogRepository] findBroadcastDates 실패:", err.message);
      return [];
    }
  }

  async findLastLogDates(channelPK, limit = 10) {
    const sql = `
            SELECT DISTINCT DATE(live_open_date) AS broadcast_date
            FROM CHZZK_LIVE_LOGS
            WHERE channel_pk = $1
            ORDER BY broadcast_date DESC
            LIMIT $2
        `;
    const binds = [channelPK, limit];

    try {
      const result = await this.pool.query(sql, binds);
      return result.rows.map((row) => row.broadcast_date);
    } catch (err) {
      console.error("[LiveLogRepository] findLastBroadcastDates 실패:", err.message);
      return [];
    }
  }
}
