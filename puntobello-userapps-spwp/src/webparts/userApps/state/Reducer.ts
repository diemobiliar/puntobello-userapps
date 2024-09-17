import { ActionType, IAddAllApp, IAddMyApp, AppsActions, IAppsLoaded, IRemoveAllApp, IRemoveMyApp, ISetUserApps, ISetSearchText, IUpdateMyApp, IUpdateAllApp } from "./Actions";
import { IAppsState } from "./State";
import { IAppsItem } from "../models";

/**
 * Reducer function that manages the state of the application related to user and all apps.
 * The reducer handles various actions to update the state in response to dispatched actions.
 * 
 * @param {IAppsState} state - The current state of the application.
 * @param {AppsActions} action - The action being dispatched to modify the state.
 * @returns {IAppsState} The new state of the application after applying the action.
 */
export function appsReducer(state: IAppsState, action: AppsActions): IAppsState {
    switch (action.type) {
        case ActionType.AddMyApp:
            // Adds a new app to the user's apps list
            return { ...state, userApps: [action.payload, ...state.userApps] };

        case ActionType.UpdateMyApp:
            // Updates an existing app in the user's apps list
            return {
                ...state,
                userApps: state.userApps.map(app => app.id === action.payload.id ? action.payload : app)
            };

        case ActionType.RemoveMyApp:
            // Removes an app from the user's apps list
            return { ...state, userApps: state.userApps.filter(item => item.id != action.payload.id) };

        case ActionType.SetUserApps:
            // Sets the entire user apps list
            return { ...state, userApps: action.payload };

        case ActionType.AddAllApp:
            // Adds a new app to the all apps list
            return { ...state, allApps: [action.payload, ...state.allApps] };

        case ActionType.UpdateAllApp:
            // Updates an existing app in the all apps list
            return {
                ...state,
                allApps: state.allApps.map(app => app.id === action.payload.id ? action.payload : app)
            };

        case ActionType.RemoveAllApp:
            // Removes an app from the all apps list
            return { ...state, allApps: state.allApps.filter(item => item.id != action.payload.id) };

        case ActionType.SetSearchText:
            // Sets the search text used for filtering apps
            return { ...state, searchText: action.payload };

        case ActionType.AppsLoaded:
            // Marks the apps as loaded and updates the all apps and user apps lists
            return { ...state, appsLoaded: true, allApps: action.payload.allApps, userApps: action.payload.userApps };

        default:
            // Returns the current state if the action type is not recognized
            return state;
    }
}


export const addMyApp = (value: IAppsItem): IAddMyApp => ({
    type: ActionType.AddMyApp,
    payload: value,
});

export const updateMyApp = (value: IAppsItem): IUpdateMyApp => ({
    type: ActionType.UpdateMyApp,
    payload: value,
});

export const removeMyApp = (value: IAppsItem): IRemoveMyApp => ({
    type: ActionType.RemoveMyApp,
    payload: value,
});

export const setUserApps = (value: IAppsItem[]): ISetUserApps => ({
    type: ActionType.SetUserApps,
    payload: value,
});

export const addAllApp = (value: IAppsItem): IAddAllApp => ({
    type: ActionType.AddAllApp,
    payload: value,
});

export const updateAllApp = (value: IAppsItem): IUpdateAllApp => ({
    type: ActionType.UpdateAllApp,
    payload: value,
});

export const removeAllApp = (value: IAppsItem): IRemoveAllApp => ({
    type: ActionType.RemoveAllApp,
    payload: value,
});

export const setSearchText = (value: string): ISetSearchText => ({
    type: ActionType.SetSearchText,
    payload: value,
});

export const appsLoaded = (allApps: IAppsItem[], userApps: IAppsItem[]): IAppsLoaded => ({
    type: ActionType.AppsLoaded,
    payload: { allApps: allApps, userApps: userApps }
});