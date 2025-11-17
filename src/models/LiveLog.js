class LiveLog {
  channelId; //현재 채널 ID;
  liveTitle; // 제목
  status; // 방송 중인지 OPEN / CLOSE
  openDate; // 방송 시작 날짜
  closeDate; // 방송 종료 날짜
  liveCategory; // 카테고리(영어)
  liveCategoryValue; // 라이브 카테고리 값(한글임)

  constructor({
    channelId,
    liveTitle,
    status,
    openDate,
    closeDate,
    liveCategory,
    liveCategoryValue,
  }) {
    this.channelId = channelId || null;
    this.liveTitle = liveTitle || null;
    this.status = status || null;
    this.openDate = openDate ? new Date(openDate) : null;
    this.closeDate = closeDate ? new Date(closeDate) : null;
    this.liveCategory = liveCategory || null;
    this.liveCategoryValue = liveCategoryValue || null;
  }

  static fromApiContent(content) {
    if (!content) {
      return new LiveLog({});
    }
    return new LiveLog({
      channelId: content.channel?.channelId || content.channelId || null,
      liveTitle: content.liveTitle,
      status: content.status,
      openDate: content.openDate,
      closeDate: content.closeDate,
      liveCategory: content.liveCategory,
      liveCategoryValue: content.liveCategoryValue,
    });
  }

  toDB() {
    return {
      channelId: this.channelId,
      liveTitle: this.liveTitle,
      openDate: this.openDate,
      closeDate: this.closeDate,
      status: this.status,
      liveCategory: this.liveCategory,
      liveCategoryValue: this.liveCategoryValue,
    };
  }
}

export default LiveLog;
