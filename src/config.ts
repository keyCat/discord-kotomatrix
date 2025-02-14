import { config as envConfig } from 'dotenv';
import { join } from 'path';

// Load values from .env file
envConfig();

const config = {
  port: parseInt(process.env.PORT || '', 10) || 3000,
  appId: process.env.APP_ID || '',
  appKey: process.env.APP_PUBLIC_KEY || '',
  appBotToken: process.env.APP_BOT_TOKEN || '',
  dirTmpImg: join(process.cwd(), '/tmp/images'),
};

export default config;
