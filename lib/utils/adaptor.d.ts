import { AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, IServerAdapter, UIConfig } from '@bull-board/api/typings/app';
import type { IApp } from '../types';
export type EggAdaptorOpt = {
    basePath: string;
};
export declare class EggAdaptor implements IServerAdapter {
    protected readonly app: IApp;
    protected basePath: string;
    protected bullBoardQueues: BullBoardQueues | undefined;
    protected errorHandler: ((error: Error) => ControllerHandlerReturnType) | undefined;
    protected uiConfig: UIConfig;
    protected entryRoute: AppViewRoute | null;
    protected apiRoutes: AppControllerRoute[] | null;
    constructor(app: IApp, opt: EggAdaptorOpt);
    setQueues(bullBoardQueues: BullBoardQueues): IServerAdapter;
    setViewsPath(viewPath: string): IServerAdapter;
    private composePath;
    setStaticPath(staticsRoute: string, staticsPath: string): IServerAdapter;
    setEntryRoute(route: AppViewRoute): IServerAdapter;
    setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType): IServerAdapter;
    setApiRoutes(routes: AppControllerRoute[]): IServerAdapter;
    setUIConfig(config: UIConfig): IServerAdapter;
    protected setBasePath(path: string): EggAdaptor;
    handleRouteError(ctx: IApp['context'], next: () => Promise<void>): Promise<void>;
    protected registerEntryRoute(): void;
    protected registerApiRoute(): void;
    registerPlugin(): void;
}
