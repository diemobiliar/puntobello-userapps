"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePointService = void 0;
var tslib_1 = require("tslib");
// SPFx-specific imports
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_page_context_1 = require("@microsoft/sp-page-context");
// PnP JS imports
var sp_1 = require("@pnp/sp");
var all_1 = require("@pnp/sp/presets/all");
// Utilities
var utils_1 = require("../utils/utils");
/**
 * SharePointService provides methods to interact with SharePoint data,
 * specifically for retrieving all apps and user-specific apps.
 */
var SharePointService = /** @class */ (function () {
    /**
     * Initializes a new instance of the SharePointService class.
     * This constructor sets up the necessary context and initializes properties for interacting with SharePoint.
     *
     * @param {ServiceScope} serviceScope - The service scope used to consume other SPFx services.
     */
    function SharePointService(serviceScope) {
        var _this = this;
        /**
         * Retrieves a list of all applications available in the SharePoint site.
         * The results are filtered based on the provided culture.
         *
         * @param {string} culture - The culture identifier used to filter the apps.
         * @returns {Promise<IAllAppsItems[]>} A promise that resolves to an array of all apps items.
         */
        this.getAllApps = function (culture) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryFilter;
            return tslib_1.__generator(this, function (_a) {
                queryFilter = culture.length > 0 ?
                    "pb_MUILanguage eq '" + culture + "' or pb_MUILanguage eq 'Default'" :
                    "pb_MUILanguage eq 'default'";
                return [2 /*return*/, (0, all_1.Web)([this.sp.web, this.appsSiteUrl]).getList("".concat(this.allAppsRelativeUrl)).items.filter(queryFilter)()];
            });
        }); };
        /**
         * Retrieves a list of application IDs that are associated with the current user.
         *
         * @returns {Promise<string[]>} A promise that resolves to an array of application IDs.
         */
        this.getUserAppsIds = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var web, user, listItem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        web = (0, all_1.Web)([this.sp.web, this.appsSiteUrl]);
                        return [4 /*yield*/, web.ensureUser(this.userLoginName)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, web
                                .getList(this.userAppsRelativeUrl)
                                .items
                                .select('pb_UserApps')
                                .filter("pb_User eq '".concat(user.Id, "'"))
                                .top(1)()];
                    case 2:
                        listItem = _a.sent();
                        if (listItem.length === 1 && listItem[0].pb_UserApps) {
                            return [2 /*return*/, listItem[0].pb_UserApps.split(';')];
                        }
                        return [2 /*return*/, []];
                }
            });
        }); };
        serviceScope.whenFinished(function () {
            var pageContext = serviceScope.consume(sp_page_context_1.PageContext.serviceKey);
            _this.allAppsRelativeUrl = utils_1.Utility.getPBConfigUrl(true) + utils_1.Utility.getAllAppsUrl();
            _this.userAppsRelativeUrl = utils_1.Utility.getPBConfigUrl(true) + utils_1.Utility.getUserAppsUrl();
            _this.appsSiteUrl = "https://" + utils_1.Utility.getPBConfigUrl(false);
            _this.userLoginName = pageContext.legacyPageContext.userLoginName;
            _this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)({ pageContext: pageContext }));
        });
    }
    /**
     * A static service key used for consuming this service within SPFx.
     */
    SharePointService.serviceKey = sp_core_library_1.ServiceKey.create('SPFx:SharePointService', SharePointService);
    return SharePointService;
}());
exports.SharePointService = SharePointService;
//# sourceMappingURL=SharePointService.js.map