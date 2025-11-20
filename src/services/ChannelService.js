import getChzzkApiResponse from "../api/chzzk-Api.js";
import ApiChannelDTO from "../dtos/api/ApiChannelDTO.js";
import Channel from "../models/Channel.js";

class ChannelService {
  #API_BASE_URL;
  #channelRepository;
  #channelPKCache;

  constructor({ channelRepository }) {
    this.#API_BASE_URL = process.env.API_BASE_URL;
    this.#channelRepository = channelRepository;
    this.#channelPKCache = new Map();
  }

  async getChannelAllData() {
    return await this.#channelRepository.findAll();
  }

  async getChannelData(channelId) {
    if (this.#channelPKCache.has(channelId)) {
      return this.#channelPKCache.get(channelId);
    }
    const channelData = await this.#channelRepository.findByChannelId(channelId);
    if (channelData) {
      const { channelPK } = channelData;
      this.#channelPKCache.set(channelId, channelPK);
      return channelData;
    }
    return null;
  }

  async getChannelByPK(channelPK) {
    return await this.#channelRepository.findByPK(channelPK);
  }

  async getChannelPK(channelId) {
    if (this.#channelPKCache.has(channelId)) {
      return { channelPK: this.#channelPKCache.get(channelId) };
    }
    const { channelPK } = await this.getChannelData(channelId);
    return channelPK ? { channelPK } : null;
  }

  async getOrCreateChannelPK(channelId) {
    if (this.#channelPKCache.has(channelId)) {
      const channelPK = this.#channelPKCache.get(channelId);
      return { channelPK };
    }

    const channelData = await this.getChannelData(channelId);
    if (channelData) {
      return channelData;
    }

    const newChannelData = await this.updateChannelState(channelId);
    return { channelPK: newChannelData.channelPK };
  }

  async updateChannelState(channelId) {
    const channelDTO = await this.getChannelFromApi(channelId);
    const channel = new Channel(channelDTO.toDomainFields());

    const updatedChannel = await this.#channelRepository.upsertChannel(channel);
    if (updatedChannel) {
      const { channelId, channelPK } = updatedChannel;
      this.#channelPKCache.set(channelId, channelPK);
    }
    return null;
  }

  async getChannelFromApi(channelId) {
    const apiUrl = `${this.#API_BASE_URL}/service/v1/channels/${channelId}`;
    const resContent = await getChzzkApiResponse(apiUrl);
    return new ApiChannelDTO(resContent);
  }
}

export default ChannelService;
