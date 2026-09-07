"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllApps = void 0;
var tslib_1 = require("tslib");
// React and related imports
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
// Fluent UI and other third-party imports
var react_2 = require("@fluentui/react");
var _ = tslib_1.__importStar(require("lodash"));
// State management and context imports
var AppContext_1 = require("../../contexts/AppContext");
var Reducer_1 = require("../../state/Reducer");
// Service imports
var SharePointService_1 = tslib_1.__importDefault(require("../../services/SharePointService"));
// Utility imports
var utils_1 = require("../../utils");
// Styles
var Apps_1 = require("../../styles/Apps");
var Apps_module_scss_1 = tslib_1.__importDefault(require("../Apps.module.scss"));
/**
 * The `AllApps` component displays a list of all available applications for the user.
 * It retrieves application data from SharePoint, filters and sorts it, and renders it
 * in a `DetailsList` with custom row rendering and pinning functionality.
 *
 * @returns {JSX.Element} The rendered component that includes the list of all apps and related UI elements.
 *
 */
function AllApps() {
    // Retrieve context, logger, page language, app state, and dispatch function from the app context
    var _a = (0, AppContext_1.useAppContext)(), context = _a.context, pageLanguage = _a.pageLanguage, logger = _a.logger, appState = _a.appState, dispatch = _a.dispatch;
    /**
     * Loads all applications and the user's application IDs from SharePoint,
     * filters out the user's apps from the full list, and updates the app state.
     */
    function loadApps() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var service, apps_1, myAppIds_1, allApps, userApps_1, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        service = context.serviceScope.consume(SharePointService_1.default.serviceKey);
                        return [4 /*yield*/, service.getAllApps(pageLanguage.LanguageDashed)];
                    case 1:
                        apps_1 = _a.sent();
                        return [4 /*yield*/, service.getUserAppsIds(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, apps_1)];
                    case 2:
                        myAppIds_1 = _a.sent();
                        allApps = apps_1.filter(function (app) { return myAppIds_1.find(function (m) { return m === app.id; }) === undefined; });
                        userApps_1 = [];
                        myAppIds_1.forEach(function (myAppId) {
                            var app = _.find(apps_1, ['id', myAppId]);
                            if (app && app.name) {
                                userApps_1.push(app);
                            }
                        });
                        // Update the app state with the loaded apps
                        dispatch((0, Reducer_1.appsLoaded)(allApps, userApps_1));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Log an error if the apps cannot be loaded
                        logger.error('Error in loadApps', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * useEffect hook to load applications when the component mounts
     * if they haven't been loaded yet.
     */
    (0, react_1.useEffect)(function () {
        if (!appState.appsLoaded) {
            loadApps();
        }
    }, [appState.appsLoaded]);
    /**
     * Handles the pinning of an application. It updates the app state to reflect
     * the pinning, and then updates the user's app data in SharePoint.
     *
     * @param {IAppsItem} item - The app item that is being pinned.
     */
    function onPinClick(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newItem, sharePointService, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newItem = tslib_1.__assign(tslib_1.__assign({}, item), { pinned: true, unpinned: false });
                        dispatch((0, Reducer_1.removeAllApp)(item));
                        dispatch((0, Reducer_1.addMyApp)(newItem));
                        // After given timeout, reset the pinned and unpinned state of the app to false
                        // This delay allows for a smooth transition in the UI when the pin action is triggered
                        setTimeout(function () {
                            var resetItem = tslib_1.__assign(tslib_1.__assign({}, item), { pinned: false, unpinned: false });
                            dispatch((0, Reducer_1.updateMyApp)(resetItem));
                        }, 1500);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        sharePointService = context.serviceScope.consume(SharePointService_1.default.serviceKey);
                        return [4 /*yield*/, sharePointService.updateUserApps(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, tslib_1.__spreadArray([item.id], appState.userApps.map(function (i) { return i.id; }), true))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        // Log an error if the user's app data cannot be updated
                        logger.error('Error in onPinClick', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Custom row rendering function for the `DetailsList`.
     * It applies custom styles to the row based on the app's pinned status.
     *
     * @param {any} props - The properties of the row being rendered.
     * @param {any} defaultRender - The default render method provided by `DetailsList`.
     * @returns {JSX.Element} The rendered row element with custom styles.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onRenderRow(props, defaultRender) {
        var settings = tslib_1.__assign(tslib_1.__assign({}, props), { styles: Apps_1.detailsRowStyles });
        return defaultRender(settings);
    }
    /**
     * Renders the title of an application item as a link.
     * applying custom styles to the title based on the app's pinned status.
     *
     * @param {IAppsItem} item - The app item whose title is being rendered.
     * @returns {JSX.Element} The rendered title element as a link.
     */
    function renderItemTitle(item) {
        return React.createElement(react_2.Link, { title: item.description, className: "".concat(Apps_module_scss_1.default.itemTitle, " ").concat(item.unpinned ? Apps_module_scss_1.default.itemUnpinAnimation : ''), href: item.url, "data-interception": "off", target: "_blank" }, item.name);
    }
    /**
     * Renders the pin icon for an application item, with click functionality to pin the item.
     *
     * @param {IAppsItem} item - The app item whose pin icon is being rendered.
     * @returns {JSX.Element} The rendered pin icon element.
     */
    function renderItemIcon(item) {
        return (React.createElement("button", { onClick: function () { return onPinClick(item); }, key: item.id, className: "".concat(Apps_module_scss_1.default.button, " ").concat(item.unpinned ? Apps_module_scss_1.default.unpinAnimation : '') },
            React.createElement(react_2.Icon, { iconName: "Pinned", className: Apps_module_scss_1.default.buttonIcon }),
            React.createElement("span", { className: Apps_module_scss_1.default.screenreaderOnly }, utils_1.Utility.getStringTranslation4Locale('PinScreenreaderText', pageLanguage.Language))));
    }
    // Column definitions for the DetailsList
    var columns = [
        {
            key: 'title',
            name: 'Title',
            minWidth: 50,
            onRender: renderItemTitle
        },
        {
            key: 'ispinned',
            name: 'isPinned',
            minWidth: 50,
            onRender: renderItemIcon
        }
    ];
    // Filter the list of apps based on the search text from the app state
    var filteredList = appState.allApps
        .filter(function (app) { return app.name.toLocaleLowerCase().indexOf(appState.searchText.toLocaleLowerCase()) >= 0; });
    return (React.createElement("div", { className: Apps_module_scss_1.default.sectionAllApps },
        React.createElement("h2", { className: Apps_module_scss_1.default.titleMedium }, utils_1.Utility.getStringTranslation4Locale('AllApplicationsTitle', pageLanguage.Language)),
        !appState.searchText && !filteredList.length && (React.createElement("p", { className: Apps_module_scss_1.default.text }, utils_1.Utility.getStringTranslation4Locale('NoApplicationsAvailable', pageLanguage.Language))),
        appState.searchText && !filteredList.length && (React.createElement("p", { className: Apps_module_scss_1.default.text }, utils_1.Utility.getStringTranslation4Locale('NoApplicationsFound', pageLanguage.Language))),
        React.createElement(react_2.DetailsList, { items: _.sortBy(filteredList, function (a) { return a.order; }, function (a) { return a.name; }), onRenderRow: onRenderRow, columns: columns, selectionMode: react_2.SelectionMode.none, isHeaderVisible: false, enableUpdateAnimations: true, styles: Apps_1.detailsListStyles })));
}
exports.AllApps = AllApps;
//# sourceMappingURL=AllApps.js.map