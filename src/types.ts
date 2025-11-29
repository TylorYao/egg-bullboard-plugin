import { Singleton } from '@eggjs/core';
import { BullBoardConfig } from './config/config.default.js';
import { BullBoardClient } from './boot.js';

declare module '@eggjs/core' {
  // add EggAppConfig overrides types
  interface EggAppConfig {
    bullboard: BullBoardConfig;
  }
  interface EggCore {
    bullboard: BullBoardClient & Singleton<BullBoardClient>;
    bullboards: Singleton<BullBoardClient>;
  }
}
