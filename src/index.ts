import COMMANDS from './commands';
import config from './config';
import discord from './discord';
import { mkdirp } from './file';
import logger from './logger';
import { bootstrap } from './server';

async function start() {
  // create temporary directory to store images to
  const tmpPath = await mkdirp(config.dirTmpImg);
  logger.debug(`Created temp path: ${tmpPath}`);
  // install discord commands
  await discord.install(COMMANDS);
  // bootstrap and start server
  const app = await bootstrap();
  app.listen(config.port, () => {
    logger.info(`Bot is listening at http://127.0.0.1:${config.port}`);
  });
}

start();
