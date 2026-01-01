"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// React and ReactDOM imports
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
// SPFx core imports
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
// Components
var Apps_1 = require("./components/Apps");
// Services
var SharePointService_1 = tslib_1.__importDefault(require("./services/SharePointService"));
// Utilities
var utils_1 = require("./utils");
// Context and State Management
var AppContext_1 = require("./contexts/AppContext");
var State_1 = require("./state/State");
var UserAppsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(UserAppsWebPart, _super);
    function UserAppsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initializes the web part. This method sets up the logger, retrieves
     * language settings for the page, and stores them in the component's state.
     *
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     * @example
     * // This method is automatically called by the SPFx framework during initialization.
     */
    UserAppsWebPart.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.onInit.call(this).then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var listItemId, listId, language, service, _a, error_1;
                        var _b, _c;
                        return tslib_1.__generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    this.logger = utils_1.Logger.getInstance();
                                    this.logger.setContextInfo(this.context.manifest.alias + " with id " + this.context.manifest.id);
                                    this.logger.info('Logger initialized');
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 3, , 4]);
                                    listItemId = (_b = this.context.pageContext.listItem) === null || _b === void 0 ? void 0 : _b.id;
                                    listId = (_c = this.context.pageContext.list) === null || _c === void 0 ? void 0 : _c.id.toString();
                                    language = this.context.pageContext.web.language;
                                    if (!listItemId || !listId) {
                                        this.logger.warn("Not running in a page context with list/listItem");
                                        return [2 /*return*/];
                                    }
                                    service = this.context.serviceScope.consume(SharePointService_1.default.serviceKey);
                                    // PnP v4 requires full WebPartContext, not just PageContext
                                    service.setContext(this.context);
                                    _a = this;
                                    return [4 /*yield*/, service.calculateLanguage(listId, listItemId, language)];
                                case 2:
                                    _a.pageLanguage = _d.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _d.sent();
                                    this.logger.error("Error in onInit Webpart: ", error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Renders the web part. This method creates the app context, wraps the `Apps` component
     * in an `AppContextProvider`, and renders it into the web part's DOM element.
     * 💡 Hint: dispatch is passed as an empty function to the AppContextProvider, will be correctly replaced in the Apps component.
     */
    UserAppsWebPart.prototype.render = function () {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        var noOpDispatch = function () { };
        var appContext = new AppContext_1.AppContext(this.context, this.logger, this.pageLanguage, State_1.initialAppsState);
        var element = React.createElement(AppContext_1.AppContextProvider, { appContext: appContext, dispatch: noOpDispatch }, React.createElement(Apps_1.Apps));
        ReactDom.render(element, this.domElement);
    };
    UserAppsWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(UserAppsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    UserAppsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    groups: []
                }
            ]
        };
    };
    return UserAppsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = UserAppsWebPart;
//# sourceMappingURL=userAppsWebPart.js.map