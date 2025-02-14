import { mkdir, open } from 'fs/promises';
import mime from 'mime';
import { nanoid } from 'nanoid';
import { join } from 'path';
import logger from './logger';

const umask = process.umask();

export async function mkdirp(...paths: string[]): Promise<string> {
  const path = join(...paths);
  await mkdir(path, { mode: 0o0777 & ~umask, recursive: true });
  return path;
}

type WriteReadableToFileOptions = {
  mime?: string | null;
  randomFileName?: boolean;
};

export async function writeReadableToFile(
  readable: NodeJS.ReadableStream,
  path: string,
  options?: WriteReadableToFileOptions,
): Promise<string> {
  if (options?.randomFileName !== false) {
    path = join(path, `/${nanoid()}`);
  }
  if (options?.mime) {
    path += `.${mime.extension(options.mime)}`;
  }
  const fh = await open(path, 'w');
  const ws = fh.createWriteStream();
  const promise: Promise<string> = new Promise((resolve, reject) => {
    ws.once('error', (err: any) => {
      logger.error(`Unable to write file ${path}:`, err);
      reject(err);
    });
    ws.once('finish', () => {
      logger.debug(`Saved file ${path}`);
      resolve(path);
    });
  });

  readable.pipe(ws);

  return promise;
}
