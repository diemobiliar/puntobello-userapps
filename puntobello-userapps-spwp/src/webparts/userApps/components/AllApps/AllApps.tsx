// React and related imports
import * as React from 'react';
import { useEffect } from 'react';

// Fluent UI and other third-party imports
import { DetailsList, IColumn, Icon, Link, SelectionMode } from '@fluentui/react';
import * as _ from 'lodash';

// State management and context imports
import { useAppContext } from '../../contexts/AppContext';
import { addMyApp, appsLoaded, removeAllApp, updateMyApp } from '../../state/Reducer';

// Service imports
import SharePointService, { ISharePointService } from '../../services/SharePointService';

// Model imports
import { IAppsItem } from '../../models';

// Utility imports
import { Utility } from '../../utils';

// Styles
import { detailsListStyles, detailsRowStyles } from '../../styles/Apps';
import styles from '../Apps.module.scss';


/**
 * The `AllApps` component displays a list of all available applications for the user.
 * It retrieves application data from SharePoint, filters and sorts it, and renders it
 * in a `DetailsList` with custom row rendering and pinning functionality.
 * 
 * @returns {JSX.Element} The rendered component that includes the list of all apps and related UI elements.
 * 
 */
export function AllApps() {
  // Retrieve context, logger, page language, app state, and dispatch function from the app context
  const { context, pageLanguage, logger, appState, dispatch } = useAppContext();

  /**
   * Loads all applications and the user's application IDs from SharePoint,
   * filters out the user's apps from the full list, and updates the app state.
   */
  async function loadApps(): Promise<void> {
    try {
      const service: ISharePointService = context.serviceScope.consume(SharePointService.serviceKey);
      const apps = await service.getAllApps(pageLanguage.LanguageDashed);
      const myAppIds = await service.getUserAppsIds(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, apps);
      const allApps = apps.filter(app => myAppIds.find(m => m === app.id) === undefined);
      const userApps: IAppsItem[] = [];
      myAppIds.forEach(myAppId => {
        const app = _.find(apps, ['id', myAppId]);
        if (app && app.name) {
          userApps.push(app);
        }
      });
      // Update the app state with the loaded apps
      dispatch(appsLoaded(allApps, userApps));
    } catch (error) {
      // Log an error if the apps cannot be loaded
      logger.error('Error in loadApps', error);
    }
  }

  /**
   * useEffect hook to load applications when the component mounts
   * if they haven't been loaded yet.
   */
  useEffect(() => {
    if (!appState.appsLoaded) {
      loadApps();
    }
  }, [appState.appsLoaded]);

  /**
   * Handles the pinning of an application. It updates the app state to reflect
   * the pinning, and then updates the user's app data in SharePoint.
   * 
   * @param {IAppsItem} item - The app item that is being pinned.
   */
  async function onPinClick(item: IAppsItem): Promise<void> {
    const newItem = { ...item, pinned: true, unpinned: false };
    dispatch(removeAllApp(item));
    dispatch(addMyApp(newItem));
    // After given timeout, reset the pinned and unpinned state of the app to false
    // This delay allows for a smooth transition in the UI when the pin action is triggered
    setTimeout(() => {
      const resetItem = { ...item, pinned: false, unpinned: false };
      dispatch(updateMyApp(resetItem));
    }, 1500);

    try {
      const sharePointService: ISharePointService = context.serviceScope.consume(SharePointService.serviceKey);
      await sharePointService.updateUserApps(
        context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, [item.id, ...appState.userApps.map(i => i.id)]
      );
    } catch (error) {
      // Log an error if the user's app data cannot be updated
      logger.error('Error in onPinClick', error);
    }
  }

  /**
   * Custom row rendering function for the `DetailsList`.
   * It applies custom styles to the row based on the app's pinned status.
   * 
   * @param {any} props - The properties of the row being rendered.
   * @param {any} defaultRender - The default render method provided by `DetailsList`.
   * @returns {JSX.Element} The rendered row element with custom styles.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onRenderRow(props: any, defaultRender: any): JSX.Element {
    const settings = { ...props, styles: detailsRowStyles };
    return defaultRender(settings);
  }

  /**
   * Renders the title of an application item as a link.
   * applying custom styles to the title based on the app's pinned status.
   * 
   * @param {IAppsItem} item - The app item whose title is being rendered.
   * @returns {JSX.Element} The rendered title element as a link.
   */
  function renderItemTitle(item: IAppsItem): JSX.Element {
    return <Link title={item.description}  className={`${styles.itemTitle} ${item.unpinned ? styles.itemUnpinAnimation : ''}`} href={item.url} data-interception="off" target="_blank">{item.name}</Link>;
  }

  /**
   * Renders the pin icon for an application item, with click functionality to pin the item.
   * 
   * @param {IAppsItem} item - The app item whose pin icon is being rendered.
   * @returns {JSX.Element} The rendered pin icon element.
   */
  function renderItemIcon(item: IAppsItem): JSX.Element {
    return (
      <button
        onClick={() => onPinClick(item)}
        key={item.id}
        className={`${styles.button} ${item.unpinned ? styles.unpinAnimation : ''}`}>
        <Icon iconName="Pinned" className={styles.buttonIcon} />
        <span className={styles.screenreaderOnly}>
          {Utility.getStringTranslation4Locale('PinScreenreaderText', pageLanguage.Language)}
        </span>
      </button>
    );
  }

  // Column definitions for the DetailsList
  const columns: IColumn[] = [
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

  // Filter the list of apps based on the search text from the app state
  const filteredList = appState.allApps
    .filter(app => app.name.toLocaleLowerCase().indexOf(appState.searchText.toLocaleLowerCase()) >= 0);

  return (
    <div className={styles.sectionAllApps}>
      <h2 className={styles.titleMedium}>
        {Utility.getStringTranslation4Locale('AllApplicationsTitle', pageLanguage.Language)}
      </h2>

      {/* Display a message if no applications are available */}
      {!appState.searchText && !filteredList.length && (
        <p className={styles.text}>
          {Utility.getStringTranslation4Locale('NoApplicationsAvailable', pageLanguage.Language)}
        </p>
      )}

      {/* Display a message if no applications match the search text */}
      {appState.searchText && !filteredList.length && (
        <p className={styles.text}>
          {Utility.getStringTranslation4Locale('NoApplicationsFound', pageLanguage.Language)}
        </p>
      )}

      {/* Render the filtered list of applications */}
      <DetailsList
        items={_.sortBy(filteredList, a => a.order, a => a.name)}
        onRenderRow={onRenderRow}
        columns={columns}
        selectionMode={SelectionMode.none}
        isHeaderVisible={false}
        enableUpdateAnimations={true}
        styles={detailsListStyles}
      />
    </div>
  );
}
