// SPFx-specific imports
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';

// React and ReactDOM imports
import * as React from 'react';
import * as ReactDom from "react-dom";

// Components
import { MenuWidget } from './components/MenuWidget';

// Utilities
import { Logger } from './utils';

// Context and State Management
import { AppContext, AppContextProvider } from './contexts/AppContext';

export interface IUserAppsApplicationCustomizerProperties {
  userApps: string;
}

export default class UserAppsApplicationCustomizer
  extends BaseApplicationCustomizer<IUserAppsApplicationCustomizerProperties> {
  private logger: Logger;
/**
 * Initializes the web part by setting up logging and handling the application's navigation event.
 * 
 * Steps:
 * 1. Initializes a logger instance and sets the context information based on the web part's manifest.
 * 2. Adds a listener for the SharePoint application's `navigatedEvent`.
 *    - When navigation occurs, the following happens:
 *      - Activates the shy observer.
 *      - Observes the DOM for a specific element.
 *      - If the element is found or successfully created, a React component (`MenuWidget`) is rendered within the `PBUserApps` container.
 * 3. The `AppContext` object is created with the SharePoint context and logger, then passed to the `AppContextProvider` component, which wraps the `MenuWidget`.
 * 4. If the `PBUserApps` div doesn't exist, it is created and prepended to the observed parent element.
 * 5. Logs any errors encountered during the observation process.
 * 
 * @override
 * @returns {Promise<void>} 
 * The method returns a promise that completes after the navigation event is handled.
 */
  @override
  public async onInit(): Promise<void> {
    this.logger = Logger.getInstance();
    this.logger.setContextInfo(this.context.manifest.alias + " with id " + this.context.manifest.id);
    this.logger.info('Logger initialized');

    this.context.application.navigatedEvent.add(this, async () => {
      this.activateShyObserver();
      return this.observeForElement().then((parent) => {
        const appContext = new AppContext(
          this.context,
          this.logger
        );
        const element: React.ReactElement = React.createElement(
          AppContextProvider,
          { appContext },
          React.createElement(MenuWidget)
        );

        // Check if the element already exists
        let userAppsDivElement = document.getElementById('PBUserApps');
        if (!userAppsDivElement) {
          userAppsDivElement = document.createElement('div');
          userAppsDivElement.id = 'PBUserApps';
          userAppsDivElement.style.display = 'inherit';
          (parent as HTMLElement).prepend(userAppsDivElement);
        }
        ReactDom.render(element, userAppsDivElement);
      }).catch((error) => {
        this.logger.error("Error in observeForElement: ", error);
      });
    });
  }

  /**
 * Observes the DOM for the appearance of specific elements within the `spSiteHeader` div.
 * It uses a `MutationObserver` to watch for changes inside the `spSiteHeader` element and resolves the promise when any of the target elements are found.
 * 
 * The observer looks for the following elements:
 * - The "Follow" button in the Site Header (`SiteHeaderFollowButton`).
 * - The mobile version of the "Follow" button, represented by the `FavoriteStarFill` and `FavoriteStar` icons.
 * 
 * Once one of these elements is found, the observer disconnects itself, and the promise resolves with the parent element.
 * 
 * @returns {Promise<Element>} A promise that resolves when the parent of the target element is found.
 * 
 * @example
 * this.observeForElement()
 *   .then((parentElement) => {
 *     console.log('Found parent element:', parentElement);
 *   });
 * 
 * @remarks
 * - The observer is hooked to the specific `div` with the id `spSiteHeader`, so changes within this div will trigger the observer callback.
 * - If the target div `spSiteHeader` is not found in the DOM, an error message is logged, and the observer does not start.
 * - The observer disconnects itself as soon as the target element is found, preventing unnecessary further observation.
 */
  private observeForElement = (): Promise<Element> => {
    return new Promise((resolve) => {
      let observer: MutationObserver | null = null;

      observer = new MutationObserver(() => {
        const divHook = document.querySelector('*[data-automationid="SiteHeaderFollowButton"]');

        const findParent = (element: Element) => element ? element.parentElement?.parentElement : null;

        const parent = findParent(divHook);

        if (parent) {
          if (observer) observer.disconnect(); // Stop observing once found
          resolve(parent); // Resolve with the found parent
        }
      });

      // Targeting the specific div with id="spSiteHeader" for observing
      const targetNode = document.querySelector('*[data-automationid="SiteHeader"]');

      if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
      } else {
        this.logger.error("Target node spSiteHeader not found");
      }
    });
  };

  /**
   * Activates a MutationObserver that monitors the DOM for changes related to the "shyHeader" element.
   * When a matching element is found, it appends a new "UserAppsShy" div to the "shyHeader" and renders a `MenuWidget` component inside it.
   * 
   * The observer stops observing once the element is found and the widget is rendered.
   */
  private activateShyObserver = () => {
    const observer = new MutationObserver((mutations_list) => {
      mutations_list.forEach((mutation) => {
        mutation.addedNodes.forEach(() => {
          const parent = document.querySelector('div[class^=shyHeader]');
          if (parent) {
            // Check if the element already exists
            let shyApps = document.getElementById('UserAppsShy');
            if (!shyApps) {
              shyApps = document.createElement('div');
              shyApps.id = 'UserAppsShy';
              shyApps.style.cssText = 'display: inherit; margin-left: auto; order: 99';
              parent.appendChild(shyApps);
              this.logger.info('Shy observer hooked');

              const appContext = new AppContext(
                this.context,
                this.logger
              );
              const element: React.ReactElement = React.createElement(
                AppContextProvider,
                { appContext },
                React.createElement(MenuWidget)
              );
              ReactDom.render(element, shyApps);
            }
            observer.disconnect();
          }
        });
      });
    });
    const headerRow = document.querySelector(`div[class^=headerRow]`);
    if (headerRow) {
      observer.observe(headerRow, { subtree: false, childList: true });
    }
  }
}
