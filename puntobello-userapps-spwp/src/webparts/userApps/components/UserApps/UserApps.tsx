// React and related imports
import * as React from 'react';

// Fluent UI components and styles
import { DetailsList, IColumn, Icon, IDragDropEvents, Link, Selection, SelectionMode } from '@fluentui/react';

// Styles
import styles from '../Apps.module.scss';
import { detailsListStyles, detailsRowStyles } from '../../styles/Apps';

// Context and State Management
import { useAppContext } from '../../contexts/AppContext';
import { addAllApp, removeMyApp, setUserApps, updateAllApp } from '../../state/Reducer';

// Models
import { IAppsItem } from '../../models';

// Services
import SharePointService from '../../services/SharePointService';

// Utilities
import { Utility } from '../../utils';

/**
 * The `UserApps` component renders a list of user-specific applications.
 * It supports drag-and-drop functionality for reordering the applications and pinning/unpinning apps.
 * 
 * @returns {JSX.Element} The rendered user applications list component.
 */
export function UserApps() {
  // Extract context, logger, page language, app state, and dispatch function from the app context
  const { context, logger, pageLanguage, appState, dispatch } = useAppContext();

  // Variables to track the dragged item, its index, and the Y-coordinate during drag events
  let draggedItem: IAppsItem | undefined;
  let draggedIndex = -1;
  const selection: Selection = new Selection();
  let clientY = -1;

  /**
   * Inserts the dragged item before the specified item in the list and updates the app state.
   * Also updates the user's apps order in SharePoint.
   * 
   * @param {IAppsItem} item - The item before which the dragged item should be inserted.
   */
  async function insertBeforeItem(item: IAppsItem): Promise<void> {
    const draggedItems = selection.isIndexSelected(draggedIndex)
      // If multiple items are selected, use them all; otherwise, use the dragged item
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (selection.getSelection() as any)
      : [draggedItem ? draggedItem : undefined];

    // Find the index where the item should be inserted
    const insertIndex = appState.userApps.indexOf(item);
    // Filter out the dragged items from the list
    const items = appState.userApps.filter(itm => draggedItems.indexOf(itm) === -1);

    // Insert the dragged items at the correct position
    items.splice(insertIndex, 0, ...draggedItems);

    // Update the app state with the new order
    dispatch(setUserApps(items));

    try {
      // Update the order of user apps in SharePoint
      const sharePointService = context.serviceScope.consume(SharePointService.serviceKey);
      await sharePointService.updateUserApps(context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, items.map(i => i.id));
    } catch (error) {
      // Log any errors that occur during the update
      logger.error('Error in insertBeforeItem', error);
    }
  }

  /**
   * Returns the drag-and-drop event handlers for the DetailsList.
   * 
   * @returns {IDragDropEvents} The event handlers for drag-and-drop functionality.
   */
  function getDragDropEvents(): IDragDropEvents {
    return {
      canDrop: () => {
        return true;
      },
      canDrag: () => {
        return true;
      },
      // Handles the visual feedback when dragging over an item
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragEnter: (item?: any, event?: DragEvent) => {
        if (clientY === -1) {
          clientY = event.clientY;
        } else if (clientY < event.clientY) {
          return styles.isDropLeaveElement;
        } else {
          return styles.isDropElement;
        }
      },
      onDragLeave: () => {
        return;
      },
      // Handles the drop event, inserting the dragged item before the dropped-on item
      onDrop: (item?: IAppsItem) => {
        if (draggedItem) {
          insertBeforeItem(item);
        }
      },
      // Sets the dragged item and its index when dragging starts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragStart: (item?: any, itemIndex?: number) => {
        draggedItem = item;
        draggedIndex = itemIndex ? itemIndex : -1;
      },
      // Resets the drag state when dragging ends
      onDragEnd: () => {
        draggedItem = undefined;
        draggedIndex = -1;
        clientY = -1;
      },
    };
  }

  /**
   * Handles the unpinning of an application item. When an app is unpinned, it is removed from the user's apps
   * and added back to the "all apps" list. The app state is updated accordingly.
   * 
   * @param {IAppsItem} item - The app item that is being unpinned.
   */
  async function onPinClick(item: IAppsItem): Promise<void> {
    const newItem = { ...item, pinned: false, unpinned: true };
    dispatch(removeMyApp(item));
    dispatch(addAllApp(newItem));

    // Reset the animation state after a short delay
    setTimeout(() => {
      const resetItem = { ...item, pinned: false, unpinned: false };
      dispatch(updateAllApp(resetItem));
    }, 900);

    try {
      // Update the user's apps in SharePoint after unpinning
      const sharePointService = context.serviceScope.consume(SharePointService.serviceKey);
      await sharePointService.updateUserApps(
        context.pageContext.legacyPageContext.userId, context.pageContext.user.loginName, appState.userApps.filter(app => app.id !== item.id).map(i => i.id)
      );
    } catch (error) {
      // Log any errors that occur during the update
      logger.error('Error in onPinClick', error);
    }
  }

  /**
   * Renders the title of an application item as a link.
   * 
   * @param {IAppsItem} item - The app item whose title is being rendered.
   * @returns {JSX.Element} The rendered title element as a link.
   */
  function renderItemTitle(item: IAppsItem): JSX.Element {
    return (
      <Link title={item.description} className={`${styles.itemTitle} ${item.pinned ? styles.itemPinAnimation : ''}`}
        href={item.url} data-interception="off" target="_blank">
        {item.name}
      </Link>
    );
  }

  /**
   * Renders the pin icon for an application item, with click functionality to unpin the item.
   * 
   * @param {IAppsItem} item - The app item whose pin icon is being rendered.
   * @returns {JSX.Element} The rendered pin icon element.
   */
  function renderItemIcon(item: IAppsItem): JSX.Element {
    return (
      <button
        onClick={() => onPinClick(item)}
        key={item.id}
        className={`${styles.button} ${styles.buttonPinned} ${item.pinned ? styles.pinAnimation : ''}`}>
        <Icon iconName="Pinned" className={styles.buttonIcon} />
        <span className={styles.screenreaderOnly}>
          {Utility.getStringTranslation4Locale('UnpinScreenreaderText', pageLanguage.Language)}
        </span>
      </button>
    );
  }

  // Define the columns for the DetailsList
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

  /**
   * Custom row rendering function for the DetailsList.
   * Adds custom styles and handles drag-and-drop events.
   * 
   * @param {any} props - The properties of the row being rendered.
   * @param {any} defaultRender - The default render method provided by `DetailsList`.
   * @returns {JSX.Element} The rendered row element with custom styles and drag-and-drop handling.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onRenderRow(props: any, defaultRender: any): JSX.Element {
    const settings = { ...props, styles: detailsRowStyles };

    if (props.dragDropEvents) {
      settings.className = styles.isDraggable;
    }

    return defaultRender(settings);
  }

  // Get the drag-and-drop event handlers for the DetailsList
  const dragDropEvents: IDragDropEvents = getDragDropEvents();

  // Filter the list of user apps based on the search text from the app state
  const filteredList = appState.userApps
    .filter(ma => ma.name.toLocaleLowerCase().indexOf(appState.searchText.toLocaleLowerCase()) >= 0);

  return (
    <div className={styles.sectionUserApps}>
      <h2 className={styles.titleMedium}>
        {Utility.getStringTranslation4Locale('MyApplicationsTitle', pageLanguage.Language)}
      </h2>

      {/* Display a message if no user apps are pinned */}
      {!appState.searchText && !filteredList.length && (
        <p className={styles.text}>
          {Utility.getStringTranslation4Locale('NoApplicationsPinned', pageLanguage.Language)}
        </p>
      )}

      {/* Display a message if no user apps match the search text */}
      {appState.searchText && !filteredList.length && (
        <p className={styles.text}>
          {Utility.getStringTranslation4Locale('NoApplicationsFound', pageLanguage.Language)}
        </p>
      )}

      {/* Render the filtered list of user apps with drag-and-drop functionality */}
      <DetailsList
        items={filteredList}
        columns={columns}
        onRenderRow={onRenderRow}
        dragDropEvents={dragDropEvents}
        selectionMode={SelectionMode.none}
        isHeaderVisible={false}
        enableUpdateAnimations={true}
        styles={detailsListStyles}
      />
    </div>
  );
}
