"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// SPFx-specific imports
var decorators_1 = require("@microsoft/decorators");
var sp_application_base_1 = require("@microsoft/sp-application-base");
// React and ReactDOM imports
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
// Components
var MenuWidget_1 = require("./components/MenuWidget");
// Utilities
var utils_1 = require("./utils");
// Context and State Management
var AppContext_1 = require("./contexts/AppContext");
var UserAppsApplicationCustomizer = /** @class */ (function (_super) {
    tslib_1.__extends(UserAppsApplicationCustomizer, _super);
    function UserAppsApplicationCustomizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._userAppsElement = null;
        _this._shyAppsElement = null;
        /**
         * Observes the DOM to detect when the 'SiteHeaderFollowButton' becomes available and resolves with its parent element.
         *
         * This method performs the following steps:
         *
         * 1. **Starts Observing the Document Body**:
         *    - Sets up a `MutationObserver` on the `document.body` to monitor for changes in the DOM.
         *    - This is necessary because the target elements may not be immediately available when the script runs.
         *
         * 2. **Mutation Callback Logic**:
         *    - On each DOM mutation, the observer executes the callback function to check for the target elements.
         *
         *    - **Attempts to Find 'SiteHeaderFollowButton'**:
         *      - Uses `document.querySelector('*[data-automationid="SiteHeaderFollowButton"]')` to try to locate the element.
         *      - If found:
         *        - Calls the `findParent` function to get the grandparent of the `divHook` element.
         *        - Disconnects the observer to stop further observation.
         *        - Resolves the promise with the found parent element.
         *
         *    - **If 'SiteHeaderFollowButton' Is Not Found**:
         *      - Checks if the 'SiteHeader' element is present using `document.querySelector('*[data-automationid="SiteHeader"]')`.
         *      - If 'SiteHeader' is found:
         *        - Disconnects the current observer on `document.body`.
         *        - Sets up a new observer on the 'SiteHeader' element to monitor for the 'SiteHeaderFollowButton'.
         *        - This narrows the observation scope, improving performance by reducing unnecessary observations.
         *
         *      - If 'SiteHeader' is not found:
         *        - Continues observing `document.body` for further mutations.
         *
         * @returns {Promise<Element>} A promise that resolves with the parent element of the 'SiteHeaderFollowButton' when it becomes available in the DOM.
         *
         * @example
         * // Usage example:
         * this.observeForElement().then((parentElement) => {
         *   // Inject your React component into the parentElement
         *   ReactDom.render(element, parentElement);
         * }).catch((error) => {
         *   this.logger.error("Error in observeForElement:", error);
         * });
        */
        _this.observeForElement = function () {
            return new Promise(function (resolve) {
                var observer = null;
                // Function to find the parent element
                var findParent = function (element) { var _a, _b; return element ? (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) !== null && _b !== void 0 ? _b : null : null; };
                observer = new MutationObserver(function () {
                    // First, try to find the SiteHeaderFollowButton
                    var divHook = document.querySelector('*[data-automationid="SiteHeaderFollowButton"]');
                    if (divHook) {
                        var parent_1 = findParent(divHook);
                        if (parent_1) {
                            observer === null || observer === void 0 ? void 0 : observer.disconnect(); // Stop observing once found
                            resolve(parent_1); // Resolve with the found parent
                        }
                    }
                    else {
                        // If SiteHeaderFollowButton is not found, check if SiteHeader is in the DOM
                        var siteHeader = document.querySelector('*[data-automationid="SiteHeader"]');
                        if (siteHeader && observer) {
                            // Once SiteHeader is available, observe it for the FollowButton
                            observer.disconnect(); // Disconnect current observer
                            observer.observe(siteHeader, { childList: true, subtree: true });
                        }
                    }
                });
                // Start observing the body or a higher-level node for the SiteHeader
                observer.observe(document.body, { childList: true, subtree: true });
            });
        };
        /**
         * Activates a MutationObserver that monitors the DOM for changes related to the "shyHeader" element.
         * When a matching element is found, it appends a new "UserAppsShy" div to the "shyHeader" and renders a `MenuWidget` component inside it.
         *
         * The observer stops observing once the element is found and the widget is rendered.
         */
        _this.activateShyObserver = function () {
            var observer = new MutationObserver(function (mutations_list) {
                mutations_list.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function () {
                        var parent = document.querySelector('div[class^=shyHeader]');
                        if (parent) {
                            // Check if the element already exists
                            var shyApps = document.getElementById('UserAppsShy');
                            if (!shyApps) {
                                shyApps = document.createElement('div');
                                shyApps.id = 'UserAppsShy';
                                shyApps.style.cssText = 'display: inherit; margin-left: auto; order: 99';
                                parent.appendChild(shyApps);
                                _this.logger.info('Shy observer hooked');
                                var appContext = new AppContext_1.AppContext(_this.context, _this.logger);
                                var element = React.createElement(AppContext_1.AppContextProvider, { appContext: appContext }, React.createElement(MenuWidget_1.MenuWidget));
                                _this._shyAppsElement = shyApps;
                                ReactDom.render(element, _this._shyAppsElement);
                            }
                            observer.disconnect();
                        }
                    });
                });
            });
            var headerRow = document.querySelector("div[class^=headerRow]");
            if (headerRow) {
                observer.observe(headerRow, { subtree: false, childList: true });
            }
        };
        return _this;
    }
    /**
     * Initializes the web part by setting up logging and handling the application's navigation event.
     *
     * Steps:
     * 1. Initializes a logger instance and sets the context information based on the web part's manifest.
     * 2. Adds a listener for the SharePoint application's `navigatedEvent`.
     *    - When navigation occurs, the following happens:
     *      - Activates the shy observer.
     *      - Observes the DOM for a specific element.
     *      - If the element is found or successfully created, a React component (`MenuWidget`) is rendered within the `PBUserApps` container.
     * 3. The `AppContext` object is created with the SharePoint context and logger, then passed to the `AppContextProvider` component, which wraps the `MenuWidget`.
     * 4. If the `PBUserApps` div doesn't exist, it is created and prepended to the observed parent element.
     * 5. Logs any errors encountered during the observation process.
     *
     * @override
     * @returns {Promise<void>}
     * The method returns a promise that completes after the navigation event is handled.
     */
    UserAppsApplicationCustomizer.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.logger = utils_1.Logger.getInstance();
                this.logger.setContextInfo(this.context.manifest.alias + " with id " + this.context.manifest.id);
                this.logger.info('Logger initialized');
                this.context.application.navigatedEvent.add(this, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        this.activateShyObserver();
                        return [2 /*return*/, this.observeForElement().then(function (parent) {
                                var appContext = new AppContext_1.AppContext(_this.context, _this.logger);
                                var element = React.createElement(AppContext_1.AppContextProvider, { appContext: appContext }, React.createElement(MenuWidget_1.MenuWidget));
                                // Check if the element already exists
                                var userAppsDivElement = document.getElementById('PBUserApps');
                                if (!userAppsDivElement) {
                                    userAppsDivElement = document.createElement('div');
                                    userAppsDivElement.id = 'PBUserApps';
                                    userAppsDivElement.style.display = 'inherit';
                                    parent.prepend(userAppsDivElement);
                                }
                                _this._userAppsElement = userAppsDivElement;
                                ReactDom.render(element, _this._userAppsElement);
                            }).catch(function (error) {
                                _this.logger.error("Error in observeForElement: ", error);
                            })];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    UserAppsApplicationCustomizer.prototype.onDispose = function () {
        if (this._userAppsElement) {
            ReactDom.unmountComponentAtNode(this._userAppsElement);
        }
        if (this._shyAppsElement) {
            ReactDom.unmountComponentAtNode(this._shyAppsElement);
        }
        _super.prototype.onDispose.call(this);
    };
    tslib_1.__decorate([
        decorators_1.override
    ], UserAppsApplicationCustomizer.prototype, "onInit", null);
    tslib_1.__decorate([
        decorators_1.override
    ], UserAppsApplicationCustomizer.prototype, "onDispose", null);
    return UserAppsApplicationCustomizer;
}(sp_application_base_1.BaseApplicationCustomizer));
exports.default = UserAppsApplicationCustomizer;
//# sourceMappingURL=UserAppsApplicationCustomizer.js.map