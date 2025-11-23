import Video from "../models/Video.js";
class VideoRepository {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async upsertVideo(video) {
    const sql = `
            INSERT INTO CHZZK_VIDEOS 
                (video_no, video_title, channel_pk, publish_date, video_thumbnail_url, video_duration)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (video_no) 
            DO UPDATE SET 
                video_title = EXCLUDED.video_title,
                channel_pk = EXCLUDED.channel_pk,
                publish_date = EXCLUDED.publish_date,
                video_thumbnail_url = EXCLUDED.video_thumbnail_url,
                video_duration = EXCLUDED.video_duration
            RETURNING *;
        `;
    const dbData = video.toDB();
    const binds = [
      dbData.video_no,
      dbData.video_title,
      dbData.channel_pk,
      dbData.publish_date,
      dbData.video_thumbnail_url,
      dbData.video_duration,
    ];
    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0] ? Video.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[VideoRepository] upsertVideo 실패:", err.message);
      return null;
    }
  }

  async findByVideoId(videoId) {
    const sql = `SELECT * FROM CHZZK_VIDEOS WHERE video_no = $1 LIMIT 1`;
    try {
      const res = await this.#pool.query(sql, [videoId]);
      return res.rows[0] ? Video.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error(`[VideoRepository] findByVideoId 실패: ${err.message}`);
      return null;
    }
  }

  async findAllByChannelPK(channelPK) {
    const sql = `
            SELECT * FROM CHZZK_VIDEOS 
            WHERE channel_pk = $1
            ORDER BY publish_date DESC
        `;
    try {
      const res = await this.#pool.query(sql, [channelPK]);
      return res.rows.map((row) => Video.fromDBRow(row));
    } catch (err) {
      console.error("[VideoRepository] findAllByChannelPK 실패:", err.message);
      return [];
    }
  }

  async findByPK(videoPK) {
    const sql = `SELECT * FROM CHZZK_VIDEOS WHERE id = $1 LIMIT 1`;
    try {
      const res = await this.#pool.query(sql, [videoPK]);
      return res.rows[0] ? Video.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[VideoRepository] findByPK 실패:", err.message);
      return null;
    }
  }
}
export default VideoRepository;
