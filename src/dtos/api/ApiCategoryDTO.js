export default class ApiCategoryDTO {
  #categoryId;
  #categoryValue;
  #categoryType;
  #categoryImageUrl;

  constructor(apiContent) {
    if (!apiContent) throw new Error("Invalid API content");

    this.#categoryId = apiContent.categoryId ?? null;
    this.#categoryValue = apiContent.categoryValue ?? null;
    this.#categoryType = apiContent.categoryType ?? null;
    this.#categoryImageUrl = apiContent.posterImageUrl ?? null;
  }

  toDomainFields() {
    return {
      categoryId: this.#categoryId,
      categoryValue: this.#categoryValue,
      categoryType: this.#categoryType,
      categoryImageUrl: this.#categoryImageUrl,
    };
  }
}
