// React and related imports
import * as React from "react";
import { useCallback } from "react";

// Fluent UI components and styles
import { ITextFieldStyles, SearchBox } from "@fluentui/react";

// SPFx-specific utilities
import { debounce } from "@microsoft/sp-lodash-subset";

// Context and State Management
import { useAppContext } from "../../contexts/AppContext";
import { setSearchText } from "../../state/Reducer";

// Utilities
import { Utility, getRootEnv } from "../../utils";

const rootEnv = getRootEnv();

const textFieldStyles: Partial<ITextFieldStyles> = {
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
export function Search() {
    // Extract the page language and dispatch function from the app context
    const { pageLanguage, dispatch } = useAppContext();

    // Create a debounced version of the onSearch function to delay the dispatch
    // This improves performance by reducing the number of times the search action is triggered
    const debouncedSearch = useCallback(
        debounce((newValue: string) => onSearch(newValue), 500),
        []
    );

    /**
     * Handles the search action by dispatching the search text to the app state.
     * 
     * @param {string} newValue - The new search text entered by the user.
     */
    function onSearch(newValue: string) {
        dispatch(setSearchText(newValue));
    }

    /**
     * Handles the change event from the search box input field.
     * It triggers the debounced search function with the updated text.
     * 
     * @param {React.FormEvent<HTMLInputElement | HTMLTextAreaElement>} ev - The input event.
     * @param {string} text - The current text value in the search box.
     */
    function onChangeText(
        ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text: string
    ): void {
        debouncedSearch(text);
    }

    return (
        <SearchBox
            placeholder={Utility.getStringTranslation4Locale('SearchBoxPlaceholder', pageLanguage.Language)}
            onChange={onChangeText}
            styles={textFieldStyles}
            underlined={true} />
    );
}