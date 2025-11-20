export default class ApiChannelDTO {
  #channelId;
  #channelName;
  #channelImageUrl;

  constructor(apiContent) {
    if (!apiContent) throw new Error("Invalid API content");

    this.#channelId = apiContent.channelId ?? null;
    this.#channelName = apiContent.channelName ?? null;
    this.#channelImageUrl = apiContent.channelImageUrl ?? null;
  }

  toDomainFields() {
    return {
      channelId: this.#channelId,
      channelName: this.#channelName,
      channelImageUrl: this.#channelImageUrl,
    };
  }
}
