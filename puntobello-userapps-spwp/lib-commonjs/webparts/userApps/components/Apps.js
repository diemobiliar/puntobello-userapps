"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apps = void 0;
var tslib_1 = require("tslib");
// React and related imports
var React = tslib_1.__importStar(require("react"));
// Component imports
var UserApps_1 = require("./UserApps/UserApps");
var AllApps_1 = require("./AllApps/AllApps");
var Search_1 = require("./Search/Search");
// Styles
var Apps_module_scss_1 = tslib_1.__importDefault(require("./Apps.module.scss"));
// Utilities
var utils_1 = require("../utils");
// Context and State Management
var Reducer_1 = require("../state/Reducer");
var State_1 = require("../state/State");
var AppContext_1 = require("../contexts/AppContext");
function Apps() {
    // Retrieve the SharePoint context, logger, and page language from the app context
    var _a = (0, AppContext_1.useAppContext)(), context = _a.context, logger = _a.logger, pageLanguage = _a.pageLanguage;
    // Manage the application state using a reducer, with the initial state provided
    var _b = React.useReducer(Reducer_1.appsReducer, State_1.initialAppsState), state = _b[0], dispatch = _b[1];
    return (React.createElement(AppContext_1.AppContextProvider, { appContext: { context: context, logger: logger, pageLanguage: pageLanguage, appState: state }, dispatch: dispatch },
        React.createElement("div", { style: (0, utils_1.getRootEnv)().css, className: Apps_module_scss_1.default.apps },
            React.createElement(Search_1.Search, null),
            React.createElement(UserApps_1.UserApps, null),
            React.createElement(AllApps_1.AllApps, null))));
}
exports.Apps = Apps;
//# sourceMappingURL=Apps.js.map