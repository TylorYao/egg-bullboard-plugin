import type { createBullBoard } from '@bull-board/api';
import type { BoardOptions } from '@bull-board/api/typings/app';
import { Queue } from 'bullmq';
import type { Agent, Application } from 'egg';
export interface BullBoardClientOptions {
  basePath: string;
  boardOptions?: BoardOptions;
}

export interface BullBoardClientsOptions {
  [clientName: string]: BullBoardClientOptions;
}

export interface BullBoardConfig {
  default?: BullBoardClientOptions;
  client?: BullBoardClientOptions;
  clients?: BullBoardClientsOptions;
}

export interface BullBoardClient {
  instance: ReturnType<typeof createBullBoard>;
  setQueues(queues: Queue[]): void;
  replaceQueues(queues: Queue[]): void;
  addQueue: (queue: Queue) => void;
  removeQueue: (queueOrName: string | Queue) => void;
}

export type IApp = Application | Agent;
