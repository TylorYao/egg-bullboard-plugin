"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EggAdaptor = void 0;
const helper_1 = require("./helper");
const node_path_1 = __importDefault(require("node:path"));
class EggAdaptor {
    app;
    basePath = '';
    bullBoardQueues;
    errorHandler;
    uiConfig = {};
    entryRoute = null;
    apiRoutes = null;
    constructor(app, opt) {
        this.app = app;
        this.setBasePath(opt.basePath);
    }
    setQueues(bullBoardQueues) {
        this.bullBoardQueues = bullBoardQueues;
        return this;
    }
    setViewsPath(viewPath) {
        this.app.config.view.root = [this.app.config.view.root, viewPath].join(',');
        return this;
    }
    composePath(relPath) {
        return node_path_1.default.join(this.basePath, relPath);
    }
    setStaticPath(staticsRoute, staticsPath) {
        const oldDirs = (0, helper_1.toArray)(this.app.config.static?.dirs).filter(Boolean);
        const curPrefix = this.composePath(staticsRoute);
        const curDirs = [{ prefix: curPrefix, dir: staticsPath }];
        this.app.config.static = {
            ...this.app.config.static,
            dirs: oldDirs.concat(curDirs),
        };
        return this;
    }
    setEntryRoute(route) {
        this.entryRoute = route;
        return this;
    }
    setErrorHandler(handler) {
        this.errorHandler = handler;
        return this;
    }
    setApiRoutes(routes) {
        this.apiRoutes = routes;
        return this;
    }
    setUIConfig(config) {
        this.uiConfig = config;
        return this;
    }
    setBasePath(path) {
        this.basePath = path;
        return this;
    }
    async handleRouteError(ctx, next) {
        try {
            await next();
        }
        catch (error) {
            if (this.errorHandler) {
                const { status, body } = this.errorHandler(error);
                ctx.status = status ?? 500;
                ctx.body = body;
            }
        }
    }
    registerEntryRoute() {
        const { entryRoute } = this;
        (0, helper_1.appAssert)(!!entryRoute, 'entryRoute not set');
        const entryRoutes = (0, helper_1.toArray)(entryRoute.route);
        entryRoutes.forEach(entryRoutePath => {
            const joinEntryPath = node_path_1.default.join(this.basePath, entryRoutePath);
            this.app.router[entryRoute.method](joinEntryPath, this.handleRouteError, async (ctx) => {
                const { name, params } = entryRoute.handler({
                    basePath: this.basePath,
                    uiConfig: this.uiConfig,
                });
                await ctx.render(name, params);
            });
        });
    }
    registerApiRoute() {
        const { apiRoutes, bullBoardQueues } = this;
        (0, helper_1.appAssert)(!!apiRoutes, 'apiRoutes not set');
        (0, helper_1.appAssert)(!!bullBoardQueues, 'bullBoardQueues not set');
        apiRoutes.forEach(apiRoute => {
            const routes = (0, helper_1.toArray)(apiRoute.route);
            const methods = (0, helper_1.toArray)(apiRoute.method);
            methods.forEach(method => {
                routes.forEach(routePath => {
                    this.app.router.get;
                    this.app.router[method](node_path_1.default.join(this.basePath, routePath), this.handleRouteError, async (ctx) => {
                        const res = await apiRoute.handler({
                            queues: bullBoardQueues,
                            body: ctx.body,
                            params: ctx.params,
                            query: ctx.query,
                            headers: ctx.headers,
                        });
                        ctx.status = res.status ?? 200;
                        ctx.body = res.body;
                    });
                });
            });
        });
    }
    registerPlugin() {
        this.registerEntryRoute();
        this.registerApiRoute();
    }
}
exports.EggAdaptor = EggAdaptor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFkYXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0EscUNBQThDO0FBQzlDLDBEQUE2QjtBQU83QixNQUFhLFVBQVU7SUFDRixHQUFHLENBQU87SUFDbkIsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNkLGVBQWUsQ0FBOEI7SUFDN0MsWUFBWSxDQUVSO0lBQ0osUUFBUSxHQUFhLEVBQUUsQ0FBQztJQUN4QixVQUFVLEdBQXdCLElBQUksQ0FBQztJQUN2QyxTQUFTLEdBQWdDLElBQUksQ0FBQztJQUN4RCxZQUFZLEdBQVMsRUFBRSxHQUFrQjtRQUN2QyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDTSxTQUFTLENBQUMsZUFBZ0M7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ00sWUFBWSxDQUFDLFFBQWdCO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1RSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDTyxXQUFXLENBQUMsT0FBZTtRQUNqQyxPQUFPLG1CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNNLGFBQWEsQ0FDbEIsWUFBb0IsRUFDcEIsV0FBbUI7UUFFbkIsTUFBTSxPQUFPLEdBQVUsSUFBQSxnQkFBTyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMs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