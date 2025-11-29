import type { IBoot } from 'egg';
import { BullBoardClient, BullBoardClientOptions, IApp } from './types';
export declare function createBullBoardClient(config: BullBoardClientOptions, app: IApp, clientName?: string): BullBoardClient;
export declare class BullBoardBootHook implements IBoot {
    private readonly app;
    constructor(app: IApp);
    configWillLoad(): void;
}
