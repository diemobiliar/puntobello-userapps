"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
var tslib_1 = require("tslib");
// React and related imports
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
// Fluent UI components and styles
var react_2 = require("@fluentui/react");
// SPFx-specific utilities
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
// Context and State Management
var AppContext_1 = require("../../contexts/AppContext");
var Reducer_1 = require("../../state/Reducer");
// Utilities
var utils_1 = require("../../utils");
var rootEnv = (0, utils_1.getRootEnv)();
var textFieldStyles = {
    root: {
        marginBottom: '54px',
        maxWidth: 300,
        borderBottomColor: rootEnv.css['--spfx_color_grey'],
    },
};
/**
 * The `Search` component provides a search box that allows users to filter the list of applications.
 * It debounces the user's input to optimize performance, reducing the number of search actions dispatched as the user types.
 *
 * @returns {JSX.Element} The rendered search box component.
 */
function Search() {
    // Extract the page language and dispatch function from the app context
    var _a = (0, AppContext_1.useAppContext)(), pageLanguage = _a.pageLanguage, dispatch = _a.dispatch;
    // Create a debounced version of the onSearch function to delay the dispatch
    // This improves performance by reducing the number of times the search action is triggered
    var debouncedSearch = (0, react_1.useCallback)((0, sp_lodash_subset_1.debounce)(function (newValue) { return onSearch(newValue); }, 500), []);
    /**
     * Handles the search action by dispatching the search text to the app state.
     *
     * @param {string} newValue - The new search text entered by the user.
     */
    function onSearch(newValue) {
        dispatch((0, Reducer_1.setSearchText)(newValue));
    }
    /**
     * Handles the change event from the search box input field.
     * It triggers the debounced search function with the updated text.
     *
     * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} ev - The input event.
     * @param {string} text - The current text value in the search box.
     */
    function onChangeText(ev, text) {
        debouncedSearch(text !== null && text !== void 0 ? text : '');
    }
    return (React.createElement(react_2.SearchBox, { placeholder: utils_1.Utility.getStringTranslation4Locale('SearchBoxPlaceholder', pageLanguage.Language), onChange: onChangeText, styles: textFieldStyles, underlined: true }));
}
exports.Search = Search;
//# sourceMappingURL=Search.js.map