import fetch, { Headers, RequestInit, Response } from 'node-fetch';

const BASE_URL = 'https://cataas.com';
const cataas = {
  async request(endpoint: string, options?: RequestInit): Promise<Response> {
    if (!options) options = {};

    const headers = options.headers
      ? new Headers(options.headers)
      : new Headers();
    options.headers = headers;

    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Error during request to ${url}: ${res.status} ${res.statusText}`,
      );
    }

    return res;
  },

  async getCat(options?: {
    says?: string;
    size?: number;
    font?: string;
    color?: string;
    background?: string;
  }): Promise<Response> {
    let endpoint = options?.says
      ? `/cat/says/${encodeURIComponent(options.says)}`
      : '/cat';
    const searchParams = new URLSearchParams();
    if (options?.says) {
      if (options?.size) {
        searchParams.append('fontSize', String(options.size));
      }
      if (options?.font) {
        searchParams.append('font', options.font);
      }
      if (options?.color) {
        searchParams.append('fontColor', options.color);
      }
      if (options?.background) {
        searchParams.append('fontBackground', options.background);
      }
    }
    endpoint += `?${searchParams.toString()}`;
    const res = await cataas.request(endpoint, {
      headers: { Accept: 'image/*' },
    });

    return res;
  },
};

export default cataas;
