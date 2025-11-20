import getChzzkApiResponse from "../api/chzzk-Api.js";
import ApiCategoryDTO from "../dtos/api/ApiCategoryDTO.js";
import Category from "../models/Category.js";

class CategoryService {
  #categoryRepo;
  #API_BASE_URL;
  #categoryPKCache;

  constructor({ categoryRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;
    this.#categoryRepo = categoryRepository;
    this.#categoryPKCache = new Map();
  }

  // 완성
  async upsertCategory({ categoryId, categoryValue, categoryType, categoryImageUrl }) {
    const categoryModel = new Category({
      categoryId,
      categoryValue,
      categoryType,
      categoryImageUrl,
    });
    const updatedCategoryData = await this.#categoryRepo.upsertCategory(categoryModel);
    if (updatedCategoryData) {
      const { categoryPK } = updatedCategoryData;
      this.#categoryPKCache.set(categoryId, categoryPK);
      return updatedCategoryData;
    }
    return null;
  }

  // 완성
  async getOrCreateCategoryPK({ categoryId, categoryType }) {
    if (this.#categoryPKCache.has(categoryId)) {
      return { categoryPK: this.#categoryPKCache.get(categoryId) };
    }
    const category = await this.#categoryRepo.findByCategoryId(categoryId);
    if (category) {
      const { categoryPK, categoryId } = category;
      this.#categoryPKCache.set(categoryId, categoryPK);
      return { categoryPK };
    }
    const categoryDTO = await this.getCategoryApi({
      categoryType,
      categoryId,
    });
    const updateCategory = await this.upsertCategory(categoryDTO.toDomainFields());
    return { categoryPK: updateCategory.categoryPK };
  }

  async getCategories() {
    return await this.#categoryRepo.findAll();
  }

  async getCategoryByPK(categoryPK) {
    return await this.#categoryRepo.findByCategoryPK(categoryPK);
  }

  async getCategoryPK(categoryId) {
    if (this.#categoryPKCache.has(categoryId)) {
      return this.#categoryPKCache.get(categoryId);
    }
    const { categoryPK } = await this.#categoryRepo.findByCategoryId(categoryId);
    return categoryPK;
  }
  // 한번 보기
  async getCategoryApi({ categoryType, categoryId }) {
    const apiUrl = `${this.#API_BASE_URL}/service/v1/categories/${categoryType}/${categoryId}/info`;

    console.log(`[카테고리 치지직 API 요청]:  ${new Date().toLocaleTimeString()} 호출 `);
    const resContent = await getChzzkApiResponse(apiUrl);
    return new ApiCategoryDTO(resContent);
  }
}
export default CategoryService;
