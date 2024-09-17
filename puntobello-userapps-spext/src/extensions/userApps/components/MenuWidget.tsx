// React imports
import * as React from 'react';

// Fluent UI components and types
import { CommandButton, DirectionalHint, IContextualMenuItem, IContextualMenuProps, ContextualMenuItemType } from '@fluentui/react';

// Utility libraries
import * as _ from 'lodash';

// Services
import { ISharePointService, SharePointService } from '../services';

// Utilities
import { Utility, getRootEnv } from '../utils';

// Models
import IAllAppsItems from '../models/IAllAppsItems';

// Styles
import buttonStyles from '../styles/MenuWidget';

// Context
import { useAppContext } from '../contexts/AppContext';

/**
 * The MenuWidget component displays a command button that, when clicked, shows a dropdown menu.
 * The menu items are dynamically generated based on the user's apps and other relevant data.
 */
export function MenuWidget() {
  // Extracting context and logger from the app context using the custom hook
  const { context, logger } = useAppContext();

  // Getting environment-specific variables
  const rootEnv = getRootEnv();

  // State to hold the menu items for the command button
  const [MenuItems, setUserAppsMenuItems] = React.useState<IContextualMenuProps>({
    items: [],
    directionalHint: DirectionalHint.bottomRightEdge
  });

  // useEffect to load menu items when the component is mounted
  React.useEffect(() => {
    logger.info('MenuWidget.tsx, useEffect');
    getMenuWidgetItems(); // Fetch menu items when the component is initialized
  }, []);

  /**
   * Fetches menu items for the widget by getting all apps and user-specific apps, 
   * processing them, and setting the menu state.
   */
  async function getMenuWidgetItems() {
    try {
      const service: ISharePointService = context.serviceScope.consume(SharePointService.serviceKey);

      // Fetching all apps and user app IDs in parallel using Promise.all
      const [allApps, userAppIds] = await Promise.all([
        service.getAllApps(context.pageContext.cultureInfo.currentUICultureName),
        service.getUserAppsIds()
      ]);

      // Processing all apps to create menu items
      const allAppsMenuItems = processAllApps(context.pageContext.cultureInfo.currentUICultureName, allApps);

      // Filtering user apps based on userAppIds
      const userApps: IContextualMenuItem[] = [];
      userAppIds.forEach(userAppId => {
        const app = _.find(allAppsMenuItems, ['key', userAppId]);
        if (app && app.text) {
          userApps.push(app);
        }
      });

      // Creating the final menu items and updating the state
      const menuProps = createMenuItems(userApps);
      setUserAppsMenuItems(menuProps);

    } catch (error) {
      // Error handling for any issues during the fetch and processing of menu items
      logger.error('getMenuWidgetItems try catch', error);
    }
  }

  /**
   * Processes the list of all apps to generate contextual menu items.
   * 
   * @param {string} lang - The current user's language.
   * @param {IAllAppsItems[]} allApps - The list of all applications.
   * @returns {IContextualMenuItem[]} - A list of contextual menu items.
   */
  function processAllApps(lang: string, allApps: IAllAppsItems[]): IContextualMenuItem[] {
    // Sort applications by user's language preference
    allApps.sort((a, b) => {
      if (a.pb_MUILanguage === lang && b.pb_MUILanguage !== lang) {
        return -1;
      } else if (a.pb_MUILanguage !== lang && b.pb_MUILanguage === lang) {
        return 1;
      }
      return 0;
    });

    // Remove duplicate apps based on the app ID
    const seenIds = new Set();
    const filteredApps = allApps.filter((app) => {
      if (!seenIds.has(app.pb_AppId)) {
        seenIds.add(app.pb_AppId);
        return true;
      }
      return false; // Filter out duplicates
    });

    // Map the filtered apps to contextual menu items
    return filteredApps.map((app: IAllAppsItems) => {
      return {
        key: app.pb_AppId,
        text: app.Title,
        href: app.pb_LinkUrl,
        "data-interception": "off",
        target: '_blank'
      } as IContextualMenuItem;
    }) as IContextualMenuItem[];
  }

  /**
   * Creates a contextual menu structure including the user's apps and a link to manage apps.
   * 
   * @param {IContextualMenuItem[]} userApps - The list of user's applications.
   * @returns {IContextualMenuProps} - The contextual menu properties.
   */
  function createMenuItems(userApps: IContextualMenuItem[]): IContextualMenuProps {
    // URL to manage apps
    const manageAppsUrl = "https://" + Utility.getPBConfigUrl(false) + Utility.getManagementAppsUrl();

    // Adding a divider and manage apps link to the menu items
    userApps.push({
      key: 'divider_1',
      itemType: ContextualMenuItemType.Divider,
    },
      {
        key: 'manageApps',
        text: Utility.getStringTranslation4Locale('ManageUserApps', context.pageContext.cultureInfo.currentUICultureName),
        style: {
          color: rootEnv.css['--spfx_color_primary'],
        },
        fontFamily: rootEnv.css['--spfx_font_family'],
        href: manageAppsUrl,
        "data-interception": "off",
        target: '_blank'
      });

    // Return the final menu properties with styles applied
    return {
      items: userApps,
      directionalHint: DirectionalHint.bottomRightEdge,
      styles: {
        subComponentStyles: {
          menuItem: {
            root: {
              fontFamily: rootEnv.css['--spfx_font_family'],
              color: rootEnv.css['--spfx_color_callout_font'],
              transition: 'transform 0.2s ease-in-out',
              selectors: {
                ':hover': {
                  transform: 'scale(1.01)',
                },
              },
            },
          },
          callout: {
            root: {
              minWidth: '320px',
              borderRadius: rootEnv.css['--spfx_border_radius'],
              border: `1px solid ${Utility.hexToRGBA(rootEnv.css['--spfx_color_primary'], 30)}`,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            },
          },
        },
      },
    };
  }

  // Render the CommandButton with the generated menu items
  return (
    <CommandButton
      iconProps={{ iconName: rootEnv.css['--spfx_apps_fluentui_iconname'] }}
      text={Utility.getStringTranslation4Locale('MyApplicationsButton', context.pageContext.cultureInfo.currentUICultureName)}
      menuProps={MenuItems}
      styles={buttonStyles}
      // Inject css properties from our environment file
      style={rootEnv.css}
    />
  )
}
