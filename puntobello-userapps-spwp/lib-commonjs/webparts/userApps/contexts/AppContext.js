"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppContext = exports.AppContextProvider = exports.AppContext = void 0;
var tslib_1 = require("tslib");
// React and related imports
var React = tslib_1.__importStar(require("react"));
/**
 * Represents the application context used throughout the web part.
 * Contains essential information such as the SharePoint context, logger, page language, and app state.
 */
var AppContext = /** @class */ (function () {
    /**
     * Initializes a new instance of the AppContext class.
     *
     * @param {WebPartContext} context - The SharePoint web part context.
     * @param {ILogger} logger - The logger instance used for logging information and errors.
     * @param {ILanguageRepresentation} pageLanguage - The language representation for the current page.
     * @param {IAppsState} appState - The current state of the application, including user and app data.
     */
    function AppContext(context, logger, pageLanguage, appState) {
        this.context = context;
        this.logger = logger;
        this.pageLanguage = pageLanguage;
        this.appState = appState;
    }
    return AppContext;
}());
exports.AppContext = AppContext;
/**
 * React Context for managing the application state and dispatch function.
 * Provides the application context (`AppContext`) and a dispatch function for updating the app state.
 */
var AppContextInstance = React.createContext(undefined);
/**
 * The `AppContextProvider` component wraps its children with the `AppContextInstance` provider.
 * This makes the app context and dispatch function available to all nested components.
 *
 * @param {AppContext} appContext - The application context to provide.
 * @param {React.Dispatch<AppsActions>} dispatch - The dispatch function for updating the app state.
 * @param {React.ReactNode} children - The children components that will have access to the app context.
 *
 * @returns {JSX.Element} The rendered provider component wrapping the children components.
 */
var AppContextProvider = function (_a) {
    var appContext = _a.appContext, dispatch = _a.dispatch, children = _a.children;
    return React.createElement(AppContextInstance.Provider, { value: { context: appContext, dispatch: dispatch } }, children);
};
exports.AppContextProvider = AppContextProvider;
/**
 * Custom React hook that retrieves the application context from the `AppContextInstance`.
 * Ensures that the hook is only used within a component wrapped by `AppContextProvider`.
 *
 * @returns {{
*   context: WebPartContext;
*   pageLanguage: ILanguageRepresentation;
*   logger: ILogger;
*   appState: IAppsState;
*   dispatch: React.Dispatch<AppsActions>;
* }} The application context and dispatch function.
*
* @throws {Error} If the hook is used outside of an `AppContextProvider`, an error is thrown.
*
 * @example
 * // 🚀 Example of using the useAppContext hook within a functional component
 * //    You can use this hook to retrieve one or more properties like the context, logger, ...
 * import React from 'react';
 * import { useAppContext } from '..path-to-context../AppContext';
 *
 * export function MyComponent () {
 *   // Retrieve the AppContext
 *   const { context, pageLanguage } = useAppContext();
*/
var useAppContext = function () {
    var contextValue = React.useContext(AppContextInstance);
    if (!contextValue) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    var _a = contextValue.context, context = _a.context, pageLanguage = _a.pageLanguage, logger = _a.logger, appState = _a.appState;
    return { context: context, pageLanguage: pageLanguage, logger: logger, appState: appState, dispatch: contextValue.dispatch };
};
exports.useAppContext = useAppContext;
//# sourceMappingURL=AppContext.js.map