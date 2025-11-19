class CategoryRepository {
  #pool;
  constructor(pool) {
    this.#pool = pool;
  }

  // 사용: 카테고리를 추가/업데이트 함
  async upsertCategory({ liveCategory, liveCategoryValue, categoryType, image_url }) {
    const sql = `
      INSERT INTO CHZZK_CATEGORIES (value, name, type, image_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (value) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        image_url = EXCLUDED.image_url
      RETURNING id;
      `;
    const binds = [liveCategory, liveCategoryValue, categoryType, image_url];
    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0];
    } catch (err) {
      console.error("[CategoryRepository] 업셋 실패:", err.message);
      return null;
    }
  }

  // 사용: 카테고리를 아이디로 찾아서 반환
  async findByCategory({ liveCategory }) {
    try {
      const res = await this.#pool.query("SELECT * FROM CHZZK_CATEGORIES WHERE value = $1", [
        liveCategory,
      ]);
      return res.rows[0];
    } catch (err) {
      console.error("[CategoryRepository] 카테고리 찾기 실패:", err.message);
      return null;
    }
  }

  async findAll() {
    try {
      const res = await this.#pool.query(`SELECT id, value, name, type FROM CHZZK_CATEGORIES`);
      return res.rows; // [{id, value, name}, ...]
    } catch (err) {
      console.error("[CategoryRepository] findAll 실패:", err.message);
      return [];
    }
  }

  async findByPK({ categoryPK }) {
    const sql = `
      SELECT 
        id, value, name, type
      FROM CHZZK_CATEGORIES
      WHERE id = $1
      LIMIT 1
    `;
    try {
      const res = await this.#pool.query(sql, [categoryPK]);
      return res.rows[0] || null;
    } catch (err) {
      console.error("[CategoryRepository] findByPK 실패:", err.message);
      return null;
    }
  }

  // 아직 사용 X. 카테고리 이미지 업데이트용
  async updateCategoryImage({ categoryId, imageUrl }) {
    const sql = `
        UPDATE CHZZK_CATEGORIES
        SET image_url = $1
        WHERE id = $2
        RETURNING id;
    `;
    const binds = [imageUrl, categoryId];

    try {
      const res = await this.#pool.query(sql, binds);
      return res.rows[0];
    } catch (err) {
      console.error("[CategoryRepository] 이미지 업데이트 실패:", err.message);
      return null;
    }
  }
}
export default CategoryRepository;
