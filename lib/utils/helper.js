"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appAssert = exports.MESSAGE_PREFIX = exports.toArray = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
function toArray(source) {
    return Array.isArray(source) ? source : [source];
}
exports.toArray = toArray;
exports.MESSAGE_PREFIX = '[@egg/bullboard]:';
function appAssert(value, message) {
    (0, node_assert_1.default)(value, `${exports.MESSAGE_PREFIX} ${message}`);
}
exports.appAssert = appAssert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFpQztBQUVqQyxTQUFnQixPQUFPLENBQUksTUFBZTtJQUN4QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRkQsMEJBRUM7QUFFWSxRQUFBLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQztBQUVsRCxTQUFnQixTQUFTLENBQUMsS0FBYyxFQUFFLE9BQWU7SUFDdkQsSUFBQSxxQkFBTSxFQUFDLEtBQUssRUFBRSxHQUFHLHNCQUFjLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRkQsOEJBRUMifQ==