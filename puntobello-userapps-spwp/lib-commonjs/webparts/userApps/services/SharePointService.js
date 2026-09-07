"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// SPFx-specific imports
var sp_core_library_1 = require("@microsoft/sp-core-library");
// PnP JS imports
var sp_1 = require("@pnp/sp");
var webs_1 = require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/site-users/web");
// Utilities
var utils_1 = require("../utils");
var lcid = tslib_1.__importStar(require("lcid"));
/**
 * Implementation of the ISharePointService interface for interacting with SharePoint.
 * This class provides methods for retrieving and updating user applications, as well as calculating language settings.
 */
var SharePointService = /** @class */ (function () {
    /**
     * Initializes a new instance of the SharePointService class.
     *
     * @param {ServiceScope} serviceScope - The service scope from which the SharePoint context and other services are consumed.
     */
    function SharePointService(serviceScope) {
        var _this = this;
        /**
         * Calculates the language settings for the current page based on the list and item IDs.
         *
         * @param {string} listId - The ID of the SharePoint list.
         * @param {number} listItemId - The ID of the list item.
         * @param {number} defaultLanguage - The default language LCID if no language is found.
         * @returns {Promise<ILanguageRepresentation>} A promise that resolves to the language representation.
         */
        this.calculateLanguage = function (listId, listItemId, defaultLanguage) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var pageContext, languageData, error_1;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pageContext = null;
                        languageData = {
                            lcid: 0,
                            Language: '',
                            LanguageLC: '',
                            LanguageDashed: '',
                            LanguageDashedLC: '',
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getPageContext(listId, listItemId)];
                    case 2:
                        pageContext = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        this.logger.info("calculateLanguage, getPageContext returned an error, probably not running in a multilingual setup, defaulting to web language", error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        if (!pageContext || !pageContext.OData__SPIsTranslation || !pageContext.OData__SPTranslationLanguage) {
                            // If not running in a multilingual setup, default to the web language
                            languageData.lcid = defaultLanguage;
                            languageData.Language = (_a = lcid.from(defaultLanguage)) !== null && _a !== void 0 ? _a : '';
                            languageData.LanguageLC = languageData.Language.toLowerCase();
                            languageData.LanguageDashed = languageData.Language.replace('_', '-');
                            languageData.LanguageDashedLC = languageData.LanguageLC.replace('_', '-');
                            return [2 /*return*/, languageData];
                        }
                        // If the page is a translation, get the language from the page property
                        languageData.lcid = (_b = lcid.to(pageContext.OData__SPTranslationLanguage)) !== null && _b !== void 0 ? _b : 0;
                        languageData.Language = pageContext.OData__SPTranslationLanguage;
                        languageData.LanguageLC = languageData.Language.toLowerCase();
                        languageData.LanguageDashed = languageData.Language.replace('_', '-');
                        languageData.LanguageDashedLC = languageData.LanguageLC.replace('_', '-');
                        return [2 /*return*/, languageData];
                }
            });
        }); };
        /**
         * Retrieves all applications available in the specified culture.
         *
         * @param {string} culture - The culture code to filter applications (e.g., "en-US").
         * @returns {Promise<IAppsItem[]>} A promise that resolves to a list of applications.
         */
        this.getAllApps = function (culture) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryFilter, allApps, seenIds, filteredApps;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryFilter = culture.length > 0 ?
                            "pb_MUILanguage eq '" + culture + "' or pb_MUILanguage eq 'Default'" :
                            "pb_MUILanguage eq 'default'";
                        return [4 /*yield*/, (0, webs_1.Web)([this.sp.web, this.appsSiteUrl]).getList(this.allAppsRelativeUrl).items.filter(queryFilter)()];
                    case 1:
                        allApps = _a.sent();
                        // Sort so that the user's language comes first, then the default
                        allApps.sort(function (a, b) {
                            if (a.pb_MUILanguage === culture && b.pb_MUILanguage !== culture) {
                                return -1;
                            }
                            else if (a.pb_MUILanguage !== culture && b.pb_MUILanguage === culture) {
                                return 1;
                            }
                            return 0;
                        });
                        seenIds = new Set();
                        filteredApps = allApps.filter(function (app) {
                            if (!seenIds.has(app.pb_AppId)) {
                                seenIds.add(app.pb_AppId);
                                return true;
                            }
                            return false; // duplicate
                        });
                        // Map the filtered applications to IAppsItem format
                        return [2 /*return*/, filteredApps.map(function (app) { return ({
                                id: app.pb_AppId,
                                name: app.Title,
                                description: app.pb_Description,
                                url: app.pb_LinkUrl,
                                order: app.pb_SortOrder
                            }); })];
                }
            });
        }); };
        /**
         * Retrieves the IDs of the user's applications based on their user ID and login name.
         *
         * @param {string} userId - The ID of the user in SharePoint.
         * @param {string} loginName - The login name of the user.
         * @param {IAppsItem[]} allApps - The list of all available applications.
         * @returns {Promise<string[]>} A promise that resolves to a list of application IDs.
         */
        this.getUserAppsIds = function (userId, loginName, allApps) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var web, user, listItem, myAppIds, filteredAppIds;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        web = (0, webs_1.Web)([this.sp.web, this.appsSiteUrl]);
                        return [4 /*yield*/, web.ensureUser(loginName)];
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
                        if (!(listItem.length === 1 && listItem[0].pb_UserApps)) return [3 /*break*/, 5];
                        myAppIds = listItem[0].pb_UserApps.split(';');
                        filteredAppIds = myAppIds.filter(function (myAppId) {
                            return allApps.find(function (allApp) { return allApp.id === myAppId; });
                        });
                        if (!(myAppIds.length !== filteredAppIds.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateUserApps(userId, loginName, filteredAppIds)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, filteredAppIds];
                    case 5: return [2 /*return*/, []];
                }
            });
        }); };
        /**
         * Updates the user's application list in SharePoint based on the ordered items provided.
         *
         * @param {string} userId - The object ID of the user in SharePoint.
         * @param {string} loginName - The login name of the user.
         * @param {string[]} orderedItems - The ordered list of application IDs.
         * @returns {Promise<void>} A promise that resolves when the update is complete.
         */
        this.updateUserApps = function (userId, loginName, orderedItems) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var list, listItem, user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = (0, webs_1.Web)([this.sp.web, this.appsSiteUrl]).getList(this.userAppsRelativeUrl);
                        return [4 /*yield*/, list
                                .items
                                .select('Id')
                                .filter("pb_User eq '".concat(userId, "'"))
                                .top(1)()];
                    case 1:
                        listItem = _a.sent();
                        if (!(listItem.length === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, list.items.getById(listItem[0].Id).update({
                                pb_UserApps: orderedItems.join(';'),
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(listItem.length === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, webs_1.Web)([this.sp.web, this.appsSiteUrl]).ensureUser(loginName)];
                    case 4:
                        user = _a.sent();
                        return [4 /*yield*/, list.items.add({
                                pb_UserId: user.Id,
                                pb_UserApps: orderedItems.join(';'),
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Retrieves the page context for a specified list and item ID.
         *
         * @param {string} listId - The ID of the SharePoint list.
         * @param {number} listItemId - The ID of the list item.
         * @returns {Promise<IPageContext>} A promise that resolves to the page context containing relevant metadata.
         */
        this.getPageContext = function (listId, listItemId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sp.web.lists.getById(listId)
                            .items
                            .getById(listItemId)
                            .select('OData__SPIsTranslation', 'OData__SPTranslationLanguage', 'OData__SPTranslationSourceItemId')()];
                    case 1:
                        context = _a.sent();
                        return [2 /*return*/, context];
                }
            });
        }); };
        this.logger = utils_1.Logger.getInstance();
        serviceScope.whenFinished(function () {
            _this.allAppsRelativeUrl = utils_1.Utility.getPBConfigUrl(true) + utils_1.Utility.getAllAppsUrl();
            _this.userAppsRelativeUrl = utils_1.Utility.getPBConfigUrl(true) + utils_1.Utility.getUserAppsUrl();
            _this.appsSiteUrl = "https://" + utils_1.Utility.getPBConfigUrl(false);
        });
    }
    /**
     * Sets the WebPartContext for PnP JS initialization.
     * Must be called from the WebPart's onInit after service scope is consumed.
     * PnP v4 requires the full WebPartContext, not just PageContext.
     *
     * @param {any} context - The full WebPartContext from the WebPart.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SharePointService.prototype.setContext = function (context) {
        this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context));
    };
    /**
     * The ServiceKey used to register this service within the SharePoint framework's service scope.
     */
    SharePointService.serviceKey = sp_core_library_1.ServiceKey.create('SPFx:SharePointService', SharePointService);
    return SharePointService;
}());
exports.default = SharePointService;
//# sourceMappingURL=SharePointService.js.map