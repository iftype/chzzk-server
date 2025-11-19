class Category {
  liveCategory; // 카테고리(영어)
  liveCategoryValue; // 라이브 카테고리 값(한글임)
  categoryType; // 타입
  image_url; // 이미지

  constructor({ liveCategory, liveCategoryValue, categoryType, image_url }) {
    this.liveCategory = liveCategory;
    this.liveCategoryValue = liveCategoryValue;
    this.categoryType = categoryType;
    this.image_url = image_url || null;
  }

  toDB() {
    return {
      liveCategory: this.liveCategory,
      liveCategoryValue: this.liveCategoryValue,
      categoryType: this.categoryType,
      image_url: this.image_url,
    };
  }
}

export default Category;
