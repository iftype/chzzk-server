export default class ChannelRepository {
  pool;
  constructor(pool) {
    this.pool = pool;
  }
  async upsertChannel({ channelId, channelName, channelImageUrl }) {
    console.log("db저장시작", channelId, channelName, channelImageUrl);
    const sql = `
      INSERT INTO CHZZK_CHANNELS (channel_id, channel_name, profile_image_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (channel_id) 
      DO UPDATE SET channel_name = EXCLUDED.channel_name,
                    profile_image_url = EXCLUDED.profile_image_url,
                    updated_at = NOW();
    `;
    const binds = [channelId, channelName, channelImageUrl];
    try {
      await this.pool.query(sql, binds);
      console.log(`[ChannelRepository] 채널 저장/업데이트: ${channelId}`);
      return true;
    } catch (err) {
      console.error("[ChannelRepository] upsertChannel 실패:", err.message);
      return false;
    }
  }

  async findAll() {
    const sql = `SELECT * FROM CHZZK_CHANNELS`;
    try {
      const result = await this.pool.query(sql);
      return result.rows;
    } catch (err) {
      console.error("[ChannelRepository] findAll 실패:", err.message);
      return [];
    }
  }

  // 채널 하나만 가져오기
  async findChannel(channelId) {
    const sql = `SELECT * FROM CHZZK_CHANNELS WHERE channel_id = $1 LIMIT 1`;
    try {
      const result = await this.pool.query(sql, [channelId]);
      return result.rows[0] || null; // 없으면 null 반환
    } catch (err) {
      console.error(`[ChannelRepository] findChannel 실패: ${err.message}`);
      return null;
    }
  }
}
