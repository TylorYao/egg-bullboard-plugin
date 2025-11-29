import type { BullBoardClient, BullBoardConfig } from './lib/types';
declare module 'egg' {
  interface Application {
    bullboard: BullBoardClient;
    bullboards: {
      get(clientId: string): BullBoardClient;
    };
  }

  interface EggAppConfig {
    bullboard: BullBoardConfig;
  }
}
