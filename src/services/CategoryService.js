import getChzzkApiResponse from "../api/chzzk-Api.js";

class CategoryService {
  #categoryRepo;
  constructor({ categoryRepository }) {
    this.#categoryRepo = categoryRepository;
  }
  async updateCategory({ liveCategory, liveCategoryValue, categoryType, image_url }) {
    return await this.#categoryRepo.upsertCategory({
      liveCategory,
      liveCategoryValue,
      categoryType,
      image_url,
    });
  }
  async getCategories() {
    return await this.#categoryRepo.findAll();
  }

  async getOrCreateCategoryId({ liveCategory, liveCategoryValue, categoryType }) {
    const categoryData = await this.#categoryRepo.findByCategory({ liveCategory });
    if (categoryData?.id) {
      return categoryData.id;
    }
    // 저장로직
    const image_url = await this.getCategoryImageUrl({
      categoryType,
      liveCategory,
    });
    const newCategoryData = await this.updateCategory({
      liveCategory,
      liveCategoryValue,
      categoryType,
      image_url,
    });
    return newCategoryData?.id ?? null;
  }

  async getCategoryByPK(categoryPK) {
    return await this.#categoryRepo.findByPK({ categoryPK });
  }

  async updateCategoryImage() {
    return await this.#categoryRepo.updateCategoryImage({ categoryId, imageUrl });
  }

  async getCategoryImageUrl({ categoryType, liveCategory }) {
    const apiUrl = `https://api.chzzk.naver.com/service/v1/categories/${categoryType}/${liveCategory}/info`;
    console.log(`[카테고리 치지직 API 요청]:  ${new Date().toLocaleTimeString()} 호출 `);
    const { posterImageUrl } = await getChzzkApiResponse(apiUrl);
    return posterImageUrl;
  }
}
export default CategoryService;
