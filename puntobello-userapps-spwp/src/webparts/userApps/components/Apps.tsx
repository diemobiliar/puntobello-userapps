// React and related imports
import * as React from 'react';

// Component imports
import { UserApps } from './UserApps/UserApps';
import { AllApps } from './AllApps/AllApps';
import { Search } from './Search/Search';

// Styles
import styles from './Apps.module.scss';

// Utilities
import { getRootEnv } from '../utils';

// Context and State Management
import { appsReducer } from '../state/Reducer';
import { initialAppsState } from '../state/State';
import { AppContextProvider, useAppContext } from '../contexts/AppContext';

export function Apps() {
  // Retrieve the SharePoint context, logger, and page language from the app context
  const { context, logger, pageLanguage } = useAppContext();

  // Manage the application state using a reducer, with the initial state provided
  const [state, dispatch] = React.useReducer(appsReducer, initialAppsState);

  return (
    <AppContextProvider appContext={{ context, logger, pageLanguage, appState: state }} dispatch={dispatch}>
      {/* Inject css properties from our environment file */}
      <div style={getRootEnv().css} className={styles.apps}>
        <Search />
        <UserApps />
        <AllApps />
      </div>
    </AppContextProvider>
  );
}