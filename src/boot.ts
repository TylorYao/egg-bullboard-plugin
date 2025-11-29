import { EggCore, ILifecycleBoot } from '@eggjs/core';
import { BullBoardClientOptions } from './config/config.default.js';

import { createBullBoard } from '@bull-board/api';

import { EggAdaptor } from './utils/adaptor.js';
import { appAssert, MESSAGE_PREFIX } from './utils/helper.js';

export type BullBoardClient = {
  instance: ReturnType<typeof createBullBoard>;
};

export function createBullBoardClient(
  config: BullBoardClientOptions,
  app: EggCore,
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

export class BullBoardBootHook implements ILifecycleBoot {
  private readonly app: EggCore;
  constructor(app: EggCore) {
    this.app = app;
  }
  configWillLoad(): void {
    this.app.addSingleton('bullboard', createBullBoardClient as any);
    // Reflect.defineProperty(this.app, 'bullboard', {
    //   get() {
    //     return this.bullboard;
    //   },
    // });
  }

  configDidLoad(): void {}
}
