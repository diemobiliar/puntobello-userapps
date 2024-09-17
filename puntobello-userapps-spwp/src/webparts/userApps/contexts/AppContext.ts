// React and related imports
import * as React from "react";

// SPFx-specific imports
import { WebPartContext } from "@microsoft/sp-webpart-base";

// Models
import { ILanguageRepresentation } from '../models';
import { ILogger } from "../models";
import { IAppsState } from '../state/State';

// State Management
import { AppsActions } from '../state/Actions';

/**
 * Represents the application context used throughout the web part.
 * Contains essential information such as the SharePoint context, logger, page language, and app state.
 */
export class AppContext {
    context: WebPartContext;
    logger: ILogger;
    pageLanguage: ILanguageRepresentation;
    appState: IAppsState;

    /**
     * Initializes a new instance of the AppContext class.
     * 
     * @param {WebPartContext} context - The SharePoint web part context.
     * @param {ILogger} logger - The logger instance used for logging information and errors.
     * @param {ILanguageRepresentation} pageLanguage - The language representation for the current page.
     * @param {IAppsState} appState - The current state of the application, including user and app data.
     */
    constructor(context: WebPartContext, logger: ILogger, pageLanguage: ILanguageRepresentation, appState: IAppsState) {
        this.context = context;
        this.logger = logger;
        this.pageLanguage = pageLanguage;
        this.appState = appState;
    }
}

/**
 * React Context for managing the application state and dispatch function.
 * Provides the application context (`AppContext`) and a dispatch function for updating the app state.
 */
const AppContextInstance = React.createContext<{ 
    context: AppContext; 
    dispatch: React.Dispatch<AppsActions>; 
} | undefined>(undefined);

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
export const AppContextProvider: React.FC<{ appContext: AppContext, dispatch: React.Dispatch<AppsActions> }> = ({ appContext, dispatch, children }) => {
    return React.createElement(
        AppContextInstance.Provider,
        { value: { context: appContext, dispatch } },
        children
    );
};

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
export const useAppContext = (): { 
   context: WebPartContext; 
   pageLanguage: ILanguageRepresentation; 
   logger: ILogger; 
   appState: IAppsState;
   dispatch: React.Dispatch<AppsActions>; 
} => {
   const contextValue = React.useContext(AppContextInstance);
   if (!contextValue) {
       throw new Error('useAppContext must be used within an AppContextProvider');
   }
   const { context, pageLanguage, logger, appState } = contextValue.context;
   
   return { context, pageLanguage, logger, appState, dispatch: contextValue.dispatch };
};

