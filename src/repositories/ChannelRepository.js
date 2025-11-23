import Channel from "../models/Channel.js";

class ChannelRepository {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async upsertChannel(channel) {
    const sql = `
      INSERT INTO CHZZK_CHANNELS (channel_id, channel_name, channel_image_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (channel_id) 
      DO UPDATE SET 
          channel_name = EXCLUDED.channel_name,
          channel_image_url = EXCLUDED.channel_image_url,
          updated_at = CASE 
              WHEN 
                CHZZK_CHANNELS.channel_name IS DISTINCT FROM EXCLUDED.channel_name OR
                CHZZK_CHANNELS.channel_image_url IS DISTINCT FROM EXCLUDED.channel_image_url
              THEN NOW() 
              ELSE CHZZK_CHANNELS.updated_at 
              END
      RETURNING *; 
        `;
    const dbData = channel.toDB();
    const binds = [dbData.channel_id, dbData.channel_name, dbData.channel_image_url];

    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0] ? Channel.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[ChannelRepository] upsertChannel 실패:", err.message);
      return null;
    }
  }

  async findAll() {
    const sql = `SELECT * FROM CHZZK_CHANNELS`;
    try {
      const res = await this.#pool.query(sql);
      return res.rows.map((row) => Channel.fromDBRow(row));
    } catch (err) {
      console.error("[ChannelRepository] findAll 실패:", err.message);
      return [];
    }
  }

  async findByChannelId(channelId) {
    const sql = `SELECT * FROM CHZZK_CHANNELS WHERE channel_id = $1 LIMIT 1`;
    try {
      const res = await this.#pool.query(sql, [channelId]);
      return res.rows[0] ? Channel.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error(`[ChannelRepository] findByChannelId 실패: ${err.message}`);
      return null;
    }
  }

  async findByPK(channelPK) {
    const sql = `
            SELECT *
            FROM CHZZK_CHANNELS
            WHERE id = $1
            LIMIT 1
        `;
    try {
      const res = await this.#pool.query(sql, [channelPK]);
      return res.rows[0] ? Channel.fromDBRow(res.rows[0]) : null;
    } catch (err) {
      console.error("[ChannelRepository] findByPK 실패:", err.message);
      return null;
    }
  }
}
export default ChannelRepository;
