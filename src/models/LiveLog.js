class LiveLog {
  #liveLogPK;
  #liveSessionId;
  #channelPK;
  #categoryPK;
  #videoPK;
  #liveTitle;
  #openDate;
  #closeDate;

  constructor({
    liveLogPK = null,
    liveSessionId,
    channelPK,
    categoryPK,
    videoPK = null,
    liveTitle,
    openDate,
    closeDate = null,
  }) {
    this.#liveLogPK = liveLogPK;
    this.#channelPK = channelPK;
    this.#categoryPK = categoryPK;
    this.#videoPK = videoPK;
    this.#liveSessionId = liveSessionId;
    this.#liveTitle = liveTitle;
    this.#openDate = openDate;
    this.#closeDate = closeDate;
  }

  toDB() {
    return {
      id: this.#liveLogPK,
      channel_pk: this.#channelPK,
      category_pk: this.#categoryPK,
      video_pk: this.#videoPK,
      live_session_id: this.#liveSessionId,
      live_title: this.#liveTitle,
      live_open_date: this.#openDate,
      live_close_date: this.#closeDate,
    };
  }

  static fromDBRow(row) {
    if (!row) return null;
    return new LiveLog({
      liveLogPK: row.id,
      liveSessionId: row.live_session_id,
      channelPK: row.channel_pk,
      categoryPK: row.category_pk,
      videoPK: row.video_pk,
      liveTitle: row.live_title,
      openDate: row.live_open_date,
      closeDate: row.live_close_date,
    });
  }

  toCache() {
    return {
      categoryPK: this.#categoryPK,
      liveSessionId: this.#liveSessionId,
      liveTitle: this.#liveTitle,
    };
  }

  toVideoMatch() {
    return {
      broadcast_session_id: this.#liveSessionId,
      live_title: this.#liveTitle,
      close_date: this.#closeDate,
    };
  }

  toResponse() {
    return {
      liveLogPK: this.#liveLogPK,
      liveSessionId: this.#liveSessionId,
      channelPK: this.#channelPK,
      categoryPK: this.#categoryPK,
      videoPK: this.#videoPK,
      liveTitle: this.#liveTitle,
      openDate: this.#openDate,
      closeDate: this.#closeDate,
    };
  }
}
export default LiveLog;
