import { verifyKeyMiddleware } from 'discord-interactions';
import express, { Application, NextFunction, Request, Response } from 'express';
import config from './config';
import * as controllers from './controllers';
import logger from './logger';

export async function bootstrap(): Promise<Application> {
  const app = express();
  // routes
  app.get('/', controllers.root);
  app.post(
    '/api/v1/interactions',
    verifyKeyMiddleware(config.appKey),
    controllers.processInteraction,
  );
  // error handler middleware
  app.use(handleErrors);

  return app;
}

function handleErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(err);
  res.status(500).json({ message: 'Something went wrong' });
}
