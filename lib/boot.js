"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullBoardBootHook = exports.createBullBoardClient = void 0;
const api_1 = require("@bull-board/api");
const adaptor_1 = require("./utils/adaptor");
const helper_1 = require("./utils/helper");
function createBullBoardClient(config, app, clientName = 'default') {
    const { basePath, boardOptions } = config;
    (0, helper_1.appAssert)(!!basePath, 'basePath is required');
    const serverAdapter = new adaptor_1.EggAdaptor(app, {
        basePath,
    });
    const instance = (0, api_1.createBullBoard)({
        options: boardOptions,
        queues: [],
        serverAdapter,
    });
    const client = {
        instance,
    };
    serverAdapter.registerPlugin();
    app.coreLogger.info(`${helper_1.MESSAGE_PREFIX} client ${clientName} created successfully`);
    return client;
}
exports.createBullBoardClient = createBullBoardClient;
class BullBoardBootHook {
    app;
    constructor(app) {
        this.app = app;
    }
    configWillLoad() {
        this.app.addSingleton('bullboard', createBullBoardClient);
    }
}
exports.BullBoardBootHook = BullBoardBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJvb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQWtEO0FBRWxELDZDQUE2QztBQUM3QywyQ0FBMkQ7QUFHM0QsU0FBZ0IscUJBQXFCLENBQ25DLE1BQThCLEVBQzlCLEdBQVMsRUFDVCxVQUFVLEdBQUcsU0FBUztJQUV0QixNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUMxQyxJQUFBLGtCQUFTLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUksb0JBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDeEMsUUFBUTtLQUNULENBQUMsQ0FBQztJQUNILE1BQU0sUUFBUSxHQUFnQyxJQUFBLHFCQUFlLEVBQUM7UUFDNUQsT0FBTyxFQUFFLFlBQVk7UUFDckIsTUFBTSxFQUFFLEVBQUU7UUFDVixhQUFhO0tBQ2QsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLEdBQW9CO1FBQzlCLFFBQVE7S0FDVCxDQUFDO0lBQ0YsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNqQixHQUFHLHVCQUFjLFdBQVcsVUFBVSx1QkFBdUIsQ0FDOUQsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUF2QkQsc0RBdUJDO0FBRUQsTUFBYSxpQkFBaUI7SUFDWCxHQUFHLENBQU87SUFDM0IsWUFBWSxHQUFTO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxjQUFjO1FBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLHFCQUE0QixDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUNGO0FBUkQsOENBUUMifQ==