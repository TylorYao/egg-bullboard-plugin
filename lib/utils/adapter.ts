import {
  AppControllerRoute,
  AppViewRoute,
  BullBoardQueues,
  ControllerHandlerReturnType,
  IServerAdapter,
  UIConfig,
} from '@bull-board/api/typings/app';

import { appAssert, toArray } from './helper';
import path from 'node:path';
import type { IApp } from '../types';

import type { Context } from 'egg';

export type EggAdapterOpt = {
  basePath: string;
};

const BYPASSY_CSRF = ['api', 'static'];

/**
 * @description notice this adapter‘s setX methods might modify app config
 * so they should be called in app lifecycles where these modifications were still allowed
 */
export class EggAdapter implements IServerAdapter {
  protected readonly app: IApp;
  protected basePath = '';
  protected viewPath = '';
  protected bullBoardQueues: BullBoardQueues | undefined;
  protected errorHandler:
    | ((error: Error) => ControllerHandlerReturnType)
    | undefined;
  protected uiConfig: UIConfig = {};
  protected entryRoute: AppViewRoute | null = null;
  protected apiRoutes: AppControllerRoute[] | null = null;
  constructor(app: IApp, opt: EggAdapterOpt) {
    this.app = app;
    this.setBasePath(opt.basePath);
    this.modifyCSRFIgnore();
  }

  protected modifyCSRFIgnore() {
    appAssert(!!this.basePath, 'basePath is required');
    if (this.app.config.security?.csrf?.enable) {
      const originalIgnore = toArray(
        this.app.config.security.csrf.ignore
      ).filter(Boolean);
      this.app.config.security.csrf.ignore = originalIgnore.concat(
        this.basePath
      );
    }
  }

  public setQueues(bullBoardQueues: BullBoardQueues): IServerAdapter {
    this.bullBoardQueues = bullBoardQueues;
    return this;
  }
  public setViewsPath(viewPath: string): IServerAdapter {
    this.viewPath = viewPath;
    /**
     * Ideally, the view path should be sufficient to locate UI files.
     * However, due to limitations in the view plugin's path resolution,
     * we modify the view root configuration here as a workaround.
     * This would impact view rendering performance by adding an extra round of path searching
     * but simplifies the rendering process here, otherwise we need to manually resolve the render engine
     * which should violate the framework's design intention
     */
    this.app.config.view.root = [this.app.config.view.root, viewPath].join(',');
    return this;
  }
  private composeRoutePath(relPath: string) {
    return path.join(this.basePath, relPath);
  }
  public setStaticPath(
    staticsRoute: string,
    staticsPath: string
  ): IServerAdapter {
    const oldDirs: any[] = toArray(this.app.config.static?.dirs).filter(
      Boolean
    );
    const curPrefix = this.composeRoutePath(staticsRoute);
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

  protected setBasePath(path: string): EggAdapter {
    this.basePath = path;
    return this;
  }
  handleRouteError = async (
    ctx: IApp['context'],
    next: () => Promise<void>
  ) => {
    try {
      await next();
    } catch (error) {
      if (this.errorHandler) {
        const { status, body } = this.errorHandler(error as Error);
        ctx.status = status ?? 500;
        ctx.body = body;
      } else throw error;
    }
  };

  handleEntryRoute = async (ctx: IApp['context']) => {
    appAssert(!!this.entryRoute, 'entryRoute not set');
    const { name, params } = this.entryRoute.handler({
      basePath: this.basePath,
      uiConfig: this.uiConfig,
    });
    await ctx.render(name, params);
  };

  /**
   * @deprecated currently not graceful way to adapt eggjs‘ csrf mechanism in such way
   */
  setCSRFCookie = async (ctx: Context, next: () => Promise<void>) => {
    await next();
    if (BYPASSY_CSRF.every(part => !ctx.path.includes(`/${part}/`))) {
      ctx.cookies.set('XSRF-TOKEN', ctx.csrf, {
        sameSite: 'lax',
        path: this.basePath,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
      });
    }
  };
  /**
   * @deprecated currently not graceful way to adapt eggjs‘ csrf mechanism in such way
   */
  adaptCSRFHeader = async (ctx: Context, next: () => Promise<void>) => {
    const csrfHeaderName =
      ctx.app.config.security?.csrf?.headerName ?? 'x-csrf-token';
    ctx.set(csrfHeaderName, ctx.get('x-xsrf-token'));
    await next();
  };

  protected registerEntryRoute() {
    const { entryRoute } = this;
    appAssert(!!entryRoute, 'entryRoute not set');
    const entryRoutes = toArray(entryRoute.route);
    entryRoutes.forEach(entryRoutePath => {
      const joinEntryPath = this.composeRoutePath(entryRoutePath);
      this.app.router[entryRoute.method](
        joinEntryPath,
        this.handleRouteError,
        // this.setCSRFCookie,
        this.handleEntryRoute
      );
    });
  }
  protected registerApiRoute() {
    const { apiRoutes } = this;
    appAssert(!!apiRoutes, 'apiRoutes not set');
    apiRoutes.forEach(apiRoute => {
      const routes = toArray(apiRoute.route);
      const methods = toArray(apiRoute.method);
      methods.forEach(method => {
        routes.forEach(routePath => {
          this.app.router[method](
            this.composeRoutePath(routePath),
            this.handleRouteError,
            // this.adaptCSRFHeader,
            async ctx => {
              appAssert(!!this.bullBoardQueues, 'bullBoardQueues not set');
              const res = await apiRoute.handler({
                queues: this.bullBoardQueues,
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
