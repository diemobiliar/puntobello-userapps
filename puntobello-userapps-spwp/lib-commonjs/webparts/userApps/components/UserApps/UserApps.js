"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApps = void 0;
var tslib_1 = require("tslib");
// React and related imports
var React = tslib_1.__importStar(require("react"));
// Fluent UI components and styles
var react_1 = require("@fluentui/react");
// Styles
var Apps_module_scss_1 = tslib_1.__importDefault(require("../Apps.module.scss"));
var Apps_1 = require("../../styles/Apps");
// Context and State Management
var AppContext_1 = require("../../contexts/AppContext");
var Reducer_1 = require("../../state/Reducer");
// Services
var SharePointService_1 = tslib_1.__importDefault(require("../../services/SharePointService"));
// Utilities
var utils_1 = require("../../utils");
/**
 * The `UserApps` component renders a list of user-specific applications.
 * It supports drag-and-drop functionality for reordering the applications and pinning/unpinning apps.
 *
 * @returns {JSX.Element} The rendered user applications list component.
 */
function UserApps() {
    // Extract context, logger, page language, app state, and dispatch function from the app context
    var _a = (0, AppContext_1.useAppContext)(), context = _a.context, logger = _a.logger, pageLanguage = _a.pageLanguage, appState = _a.appState, dispatch = _a.dispatch;
    // Variables to track the dragged item, its index, and the Y-coordinate during drag events
    var draggedItem;
    var draggedIndex = -1;
    var selection = new react_1.Selection();
    var clientY = -1;
    /**
     * Inserts the dragged item before the specified item in the list and updates the app state.
     * Also updates the user's apps order in SharePoint.
     *
     * @param {IAppsItem} item - The item before which the dragged item should be inserted.
     */
    function insertBeforeItem(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var draggedItems, insertIndex, items, sharePointService, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        draggedItems = selection.isIndexSelected(draggedIndex)
                            // If multiple items are selected, use them all; otherwise, use the dragged item
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? selection.getSelection()
                            : [draggedItem ? draggedItem : undefined];
                        insertIndex = appState.userApps.indexOf(item);
                        items = appState.userApps.filter(function (itm) { return draggedItems.indexOf(itm) === -1; });
                        // Insert the dragged items at the correct position
                        items.splice.apply(items, tslib_1.__spreadArray([insertIndex, 0], draggedItems, false));
                        // Update the app state with the new order
                        dispatch((0, Reducer_1.setUserApps)(items));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        sharePointService = context.serviceScope.consume(SharePointService_1.default.serviceKey);
                        return [4 /*yield*/, sharePointService.updateUserApps(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, items.map(function (i) { return i.id; }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Log any errors that occur during the update
                        logger.error('Error in insertBeforeItem', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Returns the drag-and-drop event handlers for the DetailsList.
     *
     * @returns {IDragDropEvents} The event handlers for drag-and-drop functionality.
     */
    function getDragDropEvents() {
        return {
            canDrop: function () {
                return true;
            },
            canDrag: function () {
                return true;
            },
            // Handles the visual feedback when dragging over an item
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragEnter: function (item, event) {
                if (!event) {
                    return '';
                }
                if (clientY === -1) {
                    clientY = event.clientY;
                    return '';
                }
                else if (clientY < event.clientY) {
                    return Apps_module_scss_1.default.isDropLeaveElement;
                }
                else {
                    return Apps_module_scss_1.default.isDropElement;
                }
            },
            onDragLeave: function () {
                return;
            },
            // Handles the drop event, inserting the dragged item before the dropped-on item
            onDrop: function (item) {
                if (draggedItem && item) {
                    insertBeforeItem(item);
                }
            },
            // Sets the dragged item and its index when dragging starts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragStart: function (item, itemIndex) {
                draggedItem = item;
                draggedIndex = itemIndex ? itemIndex : -1;
            },
            // Resets the drag state when dragging ends
            onDragEnd: function () {
                draggedItem = undefined;
                draggedIndex = -1;
                clientY = -1;
            },
        };
    }
    /**
     * Handles the unpinning of an application item. When an app is unpinned, it is removed from the user's apps
     * and added back to the "all apps" list. The app state is updated accordingly.
     *
     * @param {IAppsItem} item - The app item that is being unpinned.
     */
    function onPinClick(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newItem, sharePointService, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newItem = tslib_1.__assign(tslib_1.__assign({}, item), { pinned: false, unpinned: true });
                        dispatch((0, Reducer_1.removeMyApp)(item));
                        dispatch((0, Reducer_1.addAllApp)(newItem));
                        // Reset the animation state after a short delay
                        setTimeout(function () {
                            var resetItem = tslib_1.__assign(tslib_1.__assign({}, item), { pinned: false, unpinned: false });
                            dispatch((0, Reducer_1.updateAllApp)(resetItem));
                        }, 900);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        sharePointService = context.serviceScope.consume(SharePointService_1.default.serviceKey);
                        return [4 /*yield*/, sharePointService.updateUserApps(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, appState.userApps.filter(function (app) { return app.id !== item.id; }).map(function (i) { return i.id; }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        // Log any errors that occur during the update
                        logger.error('Error in onPinClick', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Renders the title of an application item as a link.
     *
     * @param {IAppsItem} item - The app item whose title is being rendered.
     * @returns {JSX.Element} The rendered title element as a link.
     */
    function renderItemTitle(item) {
        return (React.createElement(react_1.Link, { title: item.description, className: "".concat(Apps_module_scss_1.default.itemTitle, " ").concat(item.pinned ? Apps_module_scss_1.default.itemPinAnimation : ''), href: item.url, "data-interception": "off", target: "_blank" }, item.name));
    }
    /**
     * Renders the pin icon for an application item, with click functionality to unpin the item.
     *
     * @param {IAppsItem} item - The app item whose pin icon is being rendered.
     * @returns {JSX.Element} The rendered pin icon element.
     */
    function renderItemIcon(item) {
        return (React.createElement("button", { onClick: function () { return onPinClick(item); }, key: item.id, className: "".concat(Apps_module_scss_1.default.button, " ").concat(Apps_module_scss_1.default.buttonPinned, " ").concat(item.pinned ? Apps_module_scss_1.default.pinAnimation : '') },
            React.createElement(react_1.Icon, { iconName: "Pinned", className: Apps_module_scss_1.default.buttonIcon }),
            React.createElement("span", { className: Apps_module_scss_1.default.screenreaderOnly }, utils_1.Utility.getStringTranslation4Locale('UnpinScreenreaderText', pageLanguage.Language))));
    }
    // Define the columns for the DetailsList
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
    /**
     * Custom row rendering function for the DetailsList.
     * Adds custom styles and handles drag-and-drop events.
     *
     * @param {any} props - The properties of the row being rendered.
     * @param {any} defaultRender - The default render method provided by `DetailsList`.
     * @returns {JSX.Element} The rendered row element with custom styles and drag-and-drop handling.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onRenderRow(props, defaultRender) {
        var settings = tslib_1.__assign(tslib_1.__assign({}, props), { styles: Apps_1.detailsRowStyles });
        if (props.dragDropEvents) {
            settings.className = Apps_module_scss_1.default.isDraggable;
        }
        return defaultRender(settings);
    }
    // Get the drag-and-drop event handlers for the DetailsList
    var dragDropEvents = getDragDropEvents();
    // Filter the list of user apps based on the search text from the app state
    var filteredList = appState.userApps
        .filter(function (ma) { return ma.name.toLocaleLowerCase().indexOf(appState.searchText.toLocaleLowerCase()) >= 0; });
    return (React.createElement("div", { className: Apps_module_scss_1.default.sectionUserApps },
        React.createElement("h2", { className: Apps_module_scss_1.default.titleMedium }, utils_1.Utility.getStringTranslation4Locale('MyApplicationsTitle', pageLanguage.Language)),
        !appState.searchText && !filteredList.length && (React.createElement("p", { className: Apps_module_scss_1.default.text }, utils_1.Utility.getStringTranslation4Locale('NoApplicationsPinned', pageLanguage.Language))),
        appState.searchText && !filteredList.length && (React.createElement("p", { className: Apps_module_scss_1.default.text }, utils_1.Utility.getStringTranslation4Locale('NoApplicationsFound', pageLanguage.Language))),
        React.createElement(react_1.DetailsList, { items: filteredList, columns: columns, onRenderRow: onRenderRow, dragDropEvents: dragDropEvents, selectionMode: react_1.SelectionMode.none, isHeaderVisible: false, enableUpdateAnimations: true, styles: Apps_1.detailsListStyles })));
}
exports.UserApps = UserApps;
//# sourceMappingURL=UserApps.js.map