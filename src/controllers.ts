import { ApplicationCommandOptionType } from 'discord-api-types/payloads/v10';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import { createReadStream, unlink } from 'fs';
import { basename } from 'path';
import cataas from './cataas';
import config from './config';
import discord from './discord';
import { writeReadableToFile } from './file';
import logger from './logger';

type ControllerFn = (req: Request, res: Response) => Promise<any>;

// reduce try-catch boilerplate and prevent process from crashing (Express 4.x doesn't handle throws in async routes)
function method(
  fn: ControllerFn,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (err: any) {
      next(err);
    }
  };
}

export const root = method(async (req: Request, res: Response) => {
  res.json({ message: 'Well, hello there' });
});

export const processInteraction = method(
  async (req: Request, res: Response) => {
    const { id, type, token, data, member, channel, guild_id } = req.body;

    if (type === InteractionType.PING) {
      return res.json({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name, options } = data;
      const commandOptions = discord.readCommandOptions(options);
      const serializedOptions = Object.keys(commandOptions)
        .map((optName) => {
          let value = commandOptions[optName];
          if (typeof value === 'string') value = `"${value}"`;
          if (typeof value === 'object') value = `${JSON.stringify(value)}`;
          return `${optName}: ${value}`;
        })
        .join(', ');

      logger.debug(
        `[Discord] @${member.user.global_name} used: /${name}${serializedOptions ? ` (${serializedOptions})` : ''} [user_id: ${member.user.id}, nick "${member.nick ? member.nick : member.user.global_name}", guild_id: ${guild_id}, channel: "#${channel.name}", channel_id: ${channel.id}]`,
      );

      switch (name) {
        case 'cat':
          res.json({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          });
          // deferred response
          let fp: string | null = null;
          try {
            const cataasRes = await cataas.getCat(commandOptions);
            fp = await writeReadableToFile(cataasRes.body, config.dirTmpImg, {
              mime: cataasRes.headers.get('content-type'),
            });

            const formData = new FormData();
            formData.append(
              'payload_json',
              JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                attachments: [{ id: 0, name: basename(fp) }],
              }),
              { contentType: 'application/json' },
            );
            formData.append('files[0]', createReadStream(fp), basename(fp));
            await discord.interactionFollowup(req.body.token, {
              body: formData,
            });
          } catch (err: any) {
            logger.error(`Unable to reply to an interaction`, err);
          } finally {
            if (fp) {
              unlink(fp, (err) => {
                if (err) {
                  logger.warn(`Unable to delete file ${fp}`, err);
                } else {
                  logger.debug(`Deleted file ${fp}`);
                }
              });
            }
          }
          return;
        default:
          return res.status(400).json({ message: 'Unknown command' });
      }
    }

    return res.status(400).json({ message: 'Unknown interaction' });
  },
);
