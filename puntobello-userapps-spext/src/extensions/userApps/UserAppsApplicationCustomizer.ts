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
   * Observes the DOM to detect when the 'SiteHeaderFollowButton' becomes available and resolves with its parent element.
   *
   * This method performs the following steps:
   *
   * 1. **Starts Observing the Document Body**:
   *    - Sets up a `MutationObserver` on the `document.body` to monitor for changes in the DOM.
   *    - This is necessary because the target elements may not be immediately available when the script runs.
   *
   * 2. **Mutation Callback Logic**:
   *    - On each DOM mutation, the observer executes the callback function to check for the target elements.
   *
   *    - **Attempts to Find 'SiteHeaderFollowButton'**:
   *      - Uses `document.querySelector('*[data-automationid="SiteHeaderFollowButton"]')` to try to locate the element.
   *      - If found:
   *        - Calls the `findParent` function to get the grandparent of the `divHook` element.
   *        - Disconnects the observer to stop further observation.
   *        - Resolves the promise with the found parent element.
   *
   *    - **If 'SiteHeaderFollowButton' Is Not Found**:
   *      - Checks if the 'SiteHeader' element is present using `document.querySelector('*[data-automationid="SiteHeader"]')`.
   *      - If 'SiteHeader' is found:
   *        - Disconnects the current observer on `document.body`.
   *        - Sets up a new observer on the 'SiteHeader' element to monitor for the 'SiteHeaderFollowButton'.
   *        - This narrows the observation scope, improving performance by reducing unnecessary observations.
   *
   *      - If 'SiteHeader' is not found:
   *        - Continues observing `document.body` for further mutations.
   *
   * @returns {Promise<Element>} A promise that resolves with the parent element of the 'SiteHeaderFollowButton' when it becomes available in the DOM.
   *
   * @example
   * // Usage example:
   * this.observeForElement().then((parentElement) => {
   *   // Inject your React component into the parentElement
   *   ReactDom.render(element, parentElement);
   * }).catch((error) => {
   *   this.logger.error("Error in observeForElement:", error);
   * });
  */

  private observeForElement = (): Promise<Element> => {
    return new Promise((resolve) => {
      let observer: MutationObserver | null = null;

      // Function to find the parent element
      const findParent = (element: Element | null): Element | null =>
        element ? element.parentElement?.parentElement : null;

      observer = new MutationObserver(() => {
        // First, try to find the SiteHeaderFollowButton
        const divHook = document.querySelector('*[data-automationid="SiteHeaderFollowButton"]');

        if (divHook) {
          const parent = findParent(divHook);
          if (parent) {
            observer?.disconnect(); // Stop observing once found
            resolve(parent); // Resolve with the found parent
          }
        } else {
          // If SiteHeaderFollowButton is not found, check if SiteHeader is in the DOM
          const siteHeader = document.querySelector('*[data-automationid="SiteHeader"]');
          if (siteHeader) {
            // Once SiteHeader is available, observe it for the FollowButton
            observer?.disconnect(); // Disconnect current observer
            observer.observe(siteHeader, { childList: true, subtree: true });
          }
        }
      });

      // Start observing the body or a higher-level node for the SiteHeader
      observer.observe(document.body, { childList: true, subtree: true });
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
