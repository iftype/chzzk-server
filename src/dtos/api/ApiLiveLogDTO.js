export default class ApiLiveLogDTO {
  static LIVE_STAND = "OPEN";

  #liveTitle;
  #openDate;
  #closeDate;

  #channelId;
  #categoryId;
  #categoryValue;
  #categoryType;
  #status;

  constructor(apiContent) {
    if (!apiContent) throw new Error("Invalid API content");

    this.#liveTitle = apiContent.liveTitle ?? null;
    this.#openDate = apiContent.openDate ? new Date(apiContent.openDate) : null;
    this.#closeDate = apiContent.closeDate ? new Date(apiContent.closeDate) : null;

    this.#channelId = apiContent.channel?.channelId ?? null;
    this.#categoryId = apiContent.liveCategory ?? null;
    this.#categoryValue = apiContent.liveCategoryValue ?? null;
    this.#categoryType = apiContent.categoryType ?? null;
    this.#status = apiContent.status ?? null;
  }

  isLive() {
    return this.#status === ApiLiveLogDTO.LIVE_STAND;
  }

  toPollingStatus() {
    return {
      isLive: this.isLive(),
      closeDate: this.#closeDate,
    };
  }

  toProcessLiveLogData() {
    return {
      isLive: this.isLive(),
      liveTitle: this.#liveTitle,
      channelId: this.#channelId,
      categoryId: this.#categoryId,
      categoryType: this.#categoryType,
      closeDate: this.#closeDate,
    };
  }

  toDomainFields() {
    return {
      channelId: this.#channelId,
      liveTitle: this.#liveTitle,
      categoryId: this.#categoryId,
      openDate: this.#openDate,
      categoryType: this.#categoryType,
      closeDate: this.#closeDate,
    };
  }
}
