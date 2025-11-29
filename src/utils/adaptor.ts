import {
  AppControllerRoute,
  AppViewRoute,
  BullBoardQueues,
  ControllerHandlerReturnType,
  IServerAdapter,
  UIConfig,
} from '@bull-board/api/typings/app';

import { appAssert, toArray } from './helper.js';
import path from 'node:path';

import { EggCore } from '@eggjs/core';

export type EggAdaptorOpt = {
  basePath: string;
};

export class EggAdaptor implements IServerAdapter {
  protected readonly app: EggCore;
  protected basePath = '';
  protected bullBoardQueues: BullBoardQueues | undefined;
  protected errorHandler:
    | ((error: Error) => ControllerHandlerReturnType)
    | undefined;
  protected uiConfig: UIConfig = {};
  protected entryRoute: AppViewRoute | null = null;
  protected apiRoutes: AppControllerRoute[] | null = null;
  constructor(app: EggCore, opt: EggAdaptorOpt) {
    this.app = app;
    this.setBasePath(opt.basePath);
  }
  public setQueues(bullBoardQueues: BullBoardQueues): IServerAdapter {
    this.bullBoardQueues = bullBoardQueues;
    return this;
  }
  public setViewsPath(viewPath: string): IServerAdapter {
    this.app.config.view.root = [this.app.config.view.root, viewPath].join(',');
    return this;
  }
  private composePath(relPath: string) {
    return path.join(this.basePath, relPath);
  }
  public setStaticPath(
    staticsRoute: string,
    staticsPath: string
  ): IServerAdapter {
    const oldDirs: any[] = toArray(this.app.config.static?.dirs).filter(
      Boolean
    );
    const curPrefix = this.composePath(staticsRoute);
    const curDirs = [{ prefix: curPrefix, dir: staticsPath }];

    this.app.config.static = {
      ...this.app.config.static,
      dirs: oldDirs.concat(curDirs),
    };
    return this;
  }
  public setEntryRoute(route: AppViewRoute): IServerAdapter {
    this.entryRoute = route;
    return this;
  }
  public setErrorHandler(
    handler: (error: Error) => ControllerHandlerReturnType
  ): IServerAdapter {
    this.errorHandler = handler;
    return this;
  }
  public setApiRoutes(routes: AppControllerRoute[]): IServerAdapter {
    this.apiRoutes = routes;
    return this;
  }
  public setUIConfig(config: UIConfig): IServerAdapter {
    this.uiConfig = config;
    return this;
  }

  protected setBasePath(path: string): EggAdaptor {
    this.basePath = path;
    return this;
  }
  async handleRouteError(ctx: EggCore['context'], next: () => Promise<void>) {
    try {
      await next();
    } catch (error) {
      if (this.errorHandler) {
        const { status, body } = this.errorHandler(error as Error);
        ctx.status = status ?? 500;
        ctx.body = body;
      }
    }
  }

  protected registerEntryRoute() {
    const { entryRoute } = this;
    appAssert(!!entryRoute, 'entryRoute not set');
    const entryRoutes = toArray(entryRoute.route);
    entryRoutes.forEach(entryRoutePath => {
      const joinEntryPath = path.join(this.basePath, entryRoutePath);
      this.app.router[entryRoute.method](
        joinEntryPath,
        this.handleRouteError,
        async ctx => {
          const { name, params } = entryRoute.handler({
            basePath: this.basePath,
            uiConfig: this.uiConfig,
          });
          await ctx.render(name, params);
        }
      );
    });
  }
  protected registerApiRoute() {
    const { apiRoutes, bullBoardQueues } = this;
    appAssert(!!apiRoutes, 'apiRoutes not set');
    appAssert(!!bullBoardQueues, 'bullBoardQueues not set');
    apiRoutes.forEach(apiRoute => {
      const routes = toArray(apiRoute.route);
      const methods = toArray(apiRoute.method);
      methods.forEach(method => {
        routes.forEach(routePath => {
          this.app.router.get;
          this.app.router[method](
            path.join(this.basePath, routePath),
            this.handleRouteError,
            async ctx => {
              const res = await apiRoute.handler({
                queues: bullBoardQueues,
                body: ctx.body,
                params: ctx.params,
                query: ctx.query,
                headers: ctx.headers as any,
              });
              ctx.status = res.status ?? 200;
              ctx.body = res.body;
            }
          );
        });
      });
    });
  }
  public registerPlugin() {
    this.registerEntryRoute();
    this.registerApiRoute();
  }
}
