import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/payloads/v10';
import FormData from 'form-data';
import fetch, { Headers, RequestInit, Response } from 'node-fetch';
import config from './config';
import logger from './logger';

export type APICallOptions = Omit<RequestInit, 'body'> & { body?: any };

const discord = {
  // make authorized discord api call
  async request(endpoint: string, options?: APICallOptions): Promise<Response> {
    if (!options) options = {};

    // set default headers
    const headers = options.headers
      ? new Headers(options.headers)
      : new Headers();
    let contentType = headers.get('Content-Type');
    if (!contentType) contentType = 'application/json; charset=utf-8';
    headers.set('Content-Type', contentType);
    headers.set('Authorization', `Bot ${config.appBotToken}`);
    headers.set('User-Agent', 'DiscordBotKotomatrix (), 1.33.7');
    options.headers = headers;

    // serialize body
    if (options.body) {
      if (options.body instanceof FormData) {
        // content-type header with proper boundary will be set by node-fetch
        headers.delete('Content-Type');
      } else if (contentType.includes('application/json')) {
        options.body = JSON.stringify(options.body);
      }
    }

    const res = await fetch(`https://discord.com/api/v10${endpoint}`, options);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(JSON.stringify(data));
    }

    return res;
  },

  // install slash commands for the bot
  async install(commands: APIApplicationCommandOption[]): Promise<void> {
    try {
      await discord.request(`/applications/${config.appId}/commands`, {
        method: 'PUT',
        body: commands,
      });

      if (commands.length) {
        logger.info(
          `[Discord] Installed commands: ${commands.map((cmd) => `/${cmd.name}`).join(' ')}`,
        );
      }
    } catch (err: any) {
      console.error('Unable to install slash commands');
      throw err;
    }
  },

  async interactionFollowup(
    token: string,
    options: APICallOptions,
  ): Promise<Response> {
    options.method = 'POST';
    return discord.request(`/webhooks/${config.appId}/${token}`, options);
  },

  readCommandOptions(options: any[]): Record<string, any> {
    return (
      options.reduce((accum: Record<string, any>, option: any) => {
        switch (option.type) {
          case ApplicationCommandOptionType.Subcommand:
          case ApplicationCommandOptionType.SubcommandGroup:
            if (option.options?.length) {
              accum[option.name] = discord.readCommandOptions(option.options);
            } else {
              accum[option.name] = true;
            }
            break;
          default:
            accum[option.name] = option.value;
        }

        return accum;
      }, {}) || {}
    );
  },
};

export default discord;
