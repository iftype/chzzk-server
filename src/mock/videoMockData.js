// https://api.chzzk.naver.com/service/v1/channels/42597020c1a79fb151bd9b9beaa9779b/videos?sortType=LATEST&pagingType=PAGE&page=0&size=18&publishDateAt=&videoType=
const VIDEO_MOCK_DATA = {
  code: 200,
  message: null,
  content: {
    page: 0,
    size: 18,
    totalCount: 389,
    totalPages: 22,
    data: [
      {
        videoNo: 10246735,
        videoId: "0EEEA3E4FCD4195FC386026D6B752E986357",
        videoTitle: "아크 맛보기",
        videoType: "REPLAY",
        publishDate: "2025-11-15 03:01:28",
        thumbnailImageUrl:
          "https://video-phinf.pstatic.net/20251115_53/1763143458985b8sIh_JPEG/vb6lnJOTni_03.jpg",
        trailerUrl:
          "https://a01-g-naver-vod.akamaized.net/glive/c/read/v2/VOD_ALPHA/glive/0EEEA3E4FCD4195FC386026D6B752E986357/trailer/1763142941365/5cd812ed-c1ae-11f0-aae7-a0369ffda0f0.mp4?__gda__=1763348502_5c6aa6cdadb255eef6bec9444b19c1c2",
        duration: 30990,
        readCount: 5745,
        publishDateAt: 1763143287638,
        categoryType: "GAME",
        videoCategory: "ARC_Raiders",
        videoCategoryValue: "아크 레이더스",
        exposure: false,
        adult: false,
        clipActive: false,
        livePv: 101983,
        tags: [],
        channel: {
          channelId: "42597020c1a79fb151bd9b9beaa9779b",
          channelName: "파카",
          channelImageUrl:
            "https://nng-phinf.pstatic.net/MjAyNDAyMTRfNDMg/MDAxNzA3OTA5MTQ5NDU4.G5K-PKWURUPk7PC42iPSXn6YSOBF2I2PAW1Smzt0Wk4g.nwSoSF4VAZshbbuf2ksHk68NA5dZTqhFequVgvGWEHgg.JPEG/333333.jpg",
          verifiedMark: true,
          activatedChannelBadgeIds: [],
          personalData: {
            privateUserBlock: false,
          },
        },
        blindType: null,
        watchTimeline: null,
        paidProductId: null,
        tvAppViewingPolicyType: "ALLOWED",
      },
    ],
  },
};
