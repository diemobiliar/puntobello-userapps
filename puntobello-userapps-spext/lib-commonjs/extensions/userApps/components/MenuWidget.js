"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuWidget = void 0;
var tslib_1 = require("tslib");
// React imports
var React = tslib_1.__importStar(require("react"));
// Fluent UI components and types
var react_1 = require("@fluentui/react");
// Utility libraries
var _ = tslib_1.__importStar(require("lodash"));
// Services
var services_1 = require("../services");
// Utilities
var utils_1 = require("../utils");
// Styles
var MenuWidget_1 = tslib_1.__importDefault(require("../styles/MenuWidget"));
// Context
var AppContext_1 = require("../contexts/AppContext");
/**
 * The MenuWidget component displays a command button that, when clicked, shows a dropdown menu.
 * The menu items are dynamically generated based on the user's apps and other relevant data.
 */
function MenuWidget() {
    // Extracting context and logger from the app context using the custom hook
    var _a = (0, AppContext_1.useAppContext)(), context = _a.context, logger = _a.logger;
    // Getting environment-specific variables
    var rootEnv = (0, utils_1.getRootEnv)();
    // State to hold the menu items for the command button
    var _b = React.useState({
        items: [],
        directionalHint: react_1.DirectionalHint.bottomRightEdge
    }), MenuItems = _b[0], setUserAppsMenuItems = _b[1];
    // useEffect to load menu items when the component is mounted
    React.useEffect(function () {
        logger.info('MenuWidget.tsx, useEffect');
        getMenuWidgetItems(); // Fetch menu items when the component is initialized
    }, []);
    /**
     * Fetches menu items for the widget by getting all apps and user-specific apps,
     * processing them, and setting the menu state.
     */
    function getMenuWidgetItems() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var service, _a, allApps, userAppIds, allAppsMenuItems_1, userApps_1, menuProps, error_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        service = context.serviceScope.consume(services_1.SharePointService.serviceKey);
                        return [4 /*yield*/, Promise.all([
                                service.getAllApps(context.pageContext.cultureInfo.currentUICultureName),
                                service.getUserAppsIds()
                            ])];
                    case 1:
                        _a = _b.sent(), allApps = _a[0], userAppIds = _a[1];
                        allAppsMenuItems_1 = processAllApps(context.pageContext.cultureInfo.currentUICultureName, allApps);
                        userApps_1 = [];
                        userAppIds.forEach(function (userAppId) {
                            var app = _.find(allAppsMenuItems_1, ['key', userAppId]);
                            if (app && app.text) {
                                userApps_1.push(app);
                            }
                        });
                        menuProps = createMenuItems(userApps_1);
                        setUserAppsMenuItems(menuProps);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        // Error handling for any issues during the fetch and processing of menu items
                        logger.error('getMenuWidgetItems try catch', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Processes the list of all apps to generate contextual menu items.
     *
     * @param {string} lang - The current user's language.
     * @param {IAllAppsItems[]} allApps - The list of all applications.
     * @returns {IContextualMenuItem[]} - A list of contextual menu items.
     */
    function processAllApps(lang, allApps) {
        // Sort applications by user's language preference
        allApps.sort(function (a, b) {
            if (a.pb_MUILanguage === lang && b.pb_MUILanguage !== lang) {
                return -1;
            }
            else if (a.pb_MUILanguage !== lang && b.pb_MUILanguage === lang) {
                return 1;
            }
            return 0;
        });
        // Remove duplicate apps based on the app ID
        var seenIds = new Set();
        var filteredApps = allApps.filter(function (app) {
            if (!seenIds.has(app.pb_AppId)) {
                seenIds.add(app.pb_AppId);
                return true;
            }
            return false; // Filter out duplicates
        });
        // Map the filtered apps to contextual menu items
        return filteredApps.map(function (app) {
            return {
                key: app.pb_AppId,
                text: app.Title,
                href: app.pb_LinkUrl,
                "data-interception": "off",
                target: '_blank'
            };
        });
    }
    /**
     * Creates a contextual menu structure including the user's apps and a link to manage apps.
     *
     * @param {IContextualMenuItem[]} userApps - The list of user's applications.
     * @returns {IContextualMenuProps} - The contextual menu properties.
     */
    function createMenuItems(userApps) {
        var _a;
        // URL to manage apps
        var manageAppsUrl = "https://" + utils_1.Utility.getPBConfigUrl(false) + utils_1.Utility.getManagementAppsUrl();
        // Adding a divider and manage apps link to the menu items
        userApps.push({
            key: 'divider_1',
            itemType: react_1.ContextualMenuItemType.Divider,
        }, {
            key: 'manageApps',
            text: utils_1.Utility.getStringTranslation4Locale('ManageUserApps', context.pageContext.cultureInfo.currentUICultureName),
            style: {
                color: rootEnv.css['--spfx_color_primary'],
            },
            fontFamily: rootEnv.css['--spfx_font_family'],
            href: manageAppsUrl,
            "data-interception": "off",
            target: '_blank'
        });
        // Return the final menu properties with styles applied
        return {
            items: userApps,
            directionalHint: react_1.DirectionalHint.bottomRightEdge,
            styles: {
                subComponentStyles: {
                    menuItem: {
                        root: {
                            fontFamily: rootEnv.css['--spfx_font_family'],
                            color: rootEnv.css['--spfx_color_callout_font'],
                            transition: 'transform 0.2s ease-in-out',
                            selectors: {
                                ':hover': {
                                    transform: 'scale(1.01)',
                                },
                            },
                        },
                    },
                    callout: {
                        root: {
                            minWidth: '320px',
                            borderRadius: rootEnv.css['--spfx_border_radius'],
                            border: "1px solid ".concat(utils_1.Utility.hexToRGBA((_a = rootEnv.css['--spfx_color_primary']) !== null && _a !== void 0 ? _a : '', 30)),
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                        },
                    },
                },
            },
        };
    }
    // Render the CommandButton with the generated menu items
    return (React.createElement(react_1.CommandButton, { iconProps: { iconName: rootEnv.css['--spfx_apps_fluentui_iconname'] }, text: utils_1.Utility.getStringTranslation4Locale('MyApplicationsButton', context.pageContext.cultureInfo.currentUICultureName), menuProps: MenuItems, styles: MenuWidget_1.default, 
        // Inject css properties from our environment file
        style: rootEnv.css }));
}
exports.MenuWidget = MenuWidget;
//# sourceMappingURL=MenuWidget.js.map