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
    pic?: {
      text?: string;
      size?: number;
      font?: string;
      color?: string;
      background?: string;
    };
    gif?: {
      text?: string;
      size?: number;
      font?: string;
      color?: string;
      background?: string;
    };
  }): Promise<Response> {
    let endpoint = '/cat';
    let params = options?.gif ?? options?.pic;
    if (options?.gif) {
      endpoint = '/cat/gif';
    }
    if (params?.text) {
      endpoint += `/says/${encodeURIComponent(params.text)}`;
    }
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.size) {
        searchParams.append('fontSize', String(params.size));
      }
      if (params.font) {
        searchParams.append('font', params.font);
      }
      if (params.color) {
        searchParams.append('fontColor', params.color);
      }
      if (params.background) {
        searchParams.append('fontBackground', params.background);
      }
    }
    if (searchParams.size) {
      endpoint += `?${searchParams.toString()}`;
    }

    const res = await cataas.request(endpoint, {
      headers: { Accept: 'image/*' },
    });

    return res;
  },
};

export default cataas;
