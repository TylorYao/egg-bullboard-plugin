import type { createBullBoard } from '@bull-board/api';
import type { BoardOptions } from '@bull-board/api/typings/app';
import type { Agent, Application } from 'egg';
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
export type BullBoardClient = {
    instance: ReturnType<typeof createBullBoard>;
};
export type IApp = Application | Agent;
