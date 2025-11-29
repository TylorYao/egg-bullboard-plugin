import type { IBoot } from 'egg';
import { createBullBoard } from '@bull-board/api';

import { EggAdaptor } from './utils/adaptor';
import { appAssert, MESSAGE_PREFIX } from './utils/helper';
import { BullBoardClient, BullBoardClientOptions, IApp } from './types';

export function createBullBoardClient(
  config: BullBoardClientOptions,
  app: IApp,
  clientName = 'default'
): BullBoardClient {
  const { basePath, boardOptions } = config;
  appAssert(!!basePath, 'basePath is required');
  const serverAdapter = new EggAdaptor(app, {
    basePath,
  });
  const instance: BullBoardClient['instance'] = createBullBoard({
    options: boardOptions,
    queues: [],
    serverAdapter,
  });
  const client: BullBoardClient = {
    instance,
  };
  serverAdapter.registerPlugin();
  app.coreLogger.info(
    `${MESSAGE_PREFIX} client ${clientName} created successfully`
  );
  return client;
}

export class BullBoardBootHook implements IBoot {
  private readonly app: IApp;
  constructor(app: IApp) {
    this.app = app;
  }
  configWillLoad(): void {
    this.app.addSingleton('bullboard', createBullBoardClient);
  }
}
