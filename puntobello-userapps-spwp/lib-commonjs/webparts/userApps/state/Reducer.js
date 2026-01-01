"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsLoaded = exports.setSearchText = exports.removeAllApp = exports.updateAllApp = exports.addAllApp = exports.setUserApps = exports.removeMyApp = exports.updateMyApp = exports.addMyApp = exports.appsReducer = void 0;
var tslib_1 = require("tslib");
var Actions_1 = require("./Actions");
/**
 * Reducer function that manages the state of the application related to user and all apps.
 * The reducer handles various actions to update the state in response to dispatched actions.
 *
 * @param {IAppsState} state - The current state of the application.
 * @param {AppsActions} action - The action being dispatched to modify the state.
 * @returns {IAppsState} The new state of the application after applying the action.
 */
function appsReducer(state, action) {
    switch (action.type) {
        case Actions_1.ActionType.AddMyApp:
            // Adds a new app to the user's apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { userApps: tslib_1.__spreadArray([action.payload], state.userApps, true) });
        case Actions_1.ActionType.UpdateMyApp:
            // Updates an existing app in the user's apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { userApps: state.userApps.map(function (app) { return app.id === action.payload.id ? action.payload : app; }) });
        case Actions_1.ActionType.RemoveMyApp:
            // Removes an app from the user's apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { userApps: state.userApps.filter(function (item) { return item.id != action.payload.id; }) });
        case Actions_1.ActionType.SetUserApps:
            // Sets the entire user apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { userApps: action.payload });
        case Actions_1.ActionType.AddAllApp:
            // Adds a new app to the all apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { allApps: tslib_1.__spreadArray([action.payload], state.allApps, true) });
        case Actions_1.ActionType.UpdateAllApp:
            // Updates an existing app in the all apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { allApps: state.allApps.map(function (app) { return app.id === action.payload.id ? action.payload : app; }) });
        case Actions_1.ActionType.RemoveAllApp:
            // Removes an app from the all apps list
            return tslib_1.__assign(tslib_1.__assign({}, state), { allApps: state.allApps.filter(function (item) { return item.id != action.payload.id; }) });
        case Actions_1.ActionType.SetSearchText:
            // Sets the search text used for filtering apps
            return tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.payload });
        case Actions_1.ActionType.AppsLoaded:
            // Marks the apps as loaded and updates the all apps and user apps lists
            return tslib_1.__assign(tslib_1.__assign({}, state), { appsLoaded: true, allApps: action.payload.allApps, userApps: action.payload.userApps });
        default:
            // Returns the current state if the action type is not recognized
            return state;
    }
}
exports.appsReducer = appsReducer;
var addMyApp = function (value) { return ({
    type: Actions_1.ActionType.AddMyApp,
    payload: value,
}); };
exports.addMyApp = addMyApp;
var updateMyApp = function (value) { return ({
    type: Actions_1.ActionType.UpdateMyApp,
    payload: value,
}); };
exports.updateMyApp = updateMyApp;
var removeMyApp = function (value) { return ({
    type: Actions_1.ActionType.RemoveMyApp,
    payload: value,
}); };
exports.removeMyApp = removeMyApp;
var setUserApps = function (value) { return ({
    type: Actions_1.ActionType.SetUserApps,
    payload: value,
}); };
exports.setUserApps = setUserApps;
var addAllApp = function (value) { return ({
    type: Actions_1.ActionType.AddAllApp,
    payload: value,
}); };
exports.addAllApp = addAllApp;
var updateAllApp = function (value) { return ({
    type: Actions_1.ActionType.UpdateAllApp,
    payload: value,
}); };
exports.updateAllApp = updateAllApp;
var removeAllApp = function (value) { return ({
    type: Actions_1.ActionType.RemoveAllApp,
    payload: value,
}); };
exports.removeAllApp = removeAllApp;
var setSearchText = function (value) { return ({
    type: Actions_1.ActionType.SetSearchText,
    payload: value,
}); };
exports.setSearchText = setSearchText;
var appsLoaded = function (allApps, userApps) { return ({
    type: Actions_1.ActionType.AppsLoaded,
    payload: { allApps: allApps, userApps: userApps }
}); };
exports.appsLoaded = appsLoaded;
//# sourceMappingURL=Reducer.js.map