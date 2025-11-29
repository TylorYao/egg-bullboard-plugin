import { type BoardOptions } from '@bull-board/api/typings/app';

export interface BullBoardClientOptions {
  basePath: string;
  boardOptions: BoardOptions;
}

export interface BullBoardClientsOptions {
  [clientName: string]: BullBoardClientOptions;
}

export interface BullBoardConfig {
  default?: BullBoardClientOptions;
  client?: BullBoardClientOptions;
  clients?: BullBoardClientsOptions;
}

/**
 * egg-bullboard default config
 * @member bullboard#egg-bullboard
 * @property {String} default - the default bullboard instance option
 * @property {String} client - for singleton case option declaration
 * @property {String} clients - for multiple case option declaration
 */
export default {
  bullboard: {} as BullBoardConfig,
};
