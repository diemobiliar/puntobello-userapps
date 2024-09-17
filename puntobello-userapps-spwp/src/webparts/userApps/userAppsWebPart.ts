// React and ReactDOM imports
import * as React from 'react';
import * as ReactDom from 'react-dom';

// SPFx core imports
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

// Components
import { Apps } from './components/Apps';

// Models
import { ILanguageRepresentation } from './models';

// Services
import SharePointService, { ISharePointService } from './services/SharePointService';

// Utilities
import { Logger } from './utils';

// Context and State Management
import { AppContext, AppContextProvider } from './contexts/AppContext';
import { initialAppsState } from './state/State';
import { AppsActions } from './state/Actions';

export default class UserAppsWebPart extends BaseClientSideWebPart<never> {
  private logger: Logger;
  private pageLanguage: ILanguageRepresentation;

  /**
   * Initializes the web part. This method sets up the logger, retrieves 
   * language settings for the page, and stores them in the component's state.
   * 
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   * @example
   * // This method is automatically called by the SPFx framework during initialization.
   */
  protected async onInit(): Promise<void> {
    return super.onInit().then(async () => {
      this.logger = Logger.getInstance();
      this.logger.setContextInfo(this.context.manifest.alias + " with id " + this.context.manifest.id);
      this.logger.info('Logger initialized');

      try {
        const listItemId = this.context.pageContext.listItem.id;
        const listId = this.context.pageContext.list.id.toString();
        const language = this.context.pageContext.web.language;

        const service: ISharePointService = this.context.serviceScope.consume(SharePointService.serviceKey);
        this.pageLanguage = await service.calculateLanguage(listId, listItemId, language);
      } catch (error) {
        this.logger.error("Error in onInit Webpart: ", error);
      }
    });
  }

  /**
   * Renders the web part. This method creates the app context, wraps the `Apps` component 
   * in an `AppContextProvider`, and renders it into the web part's DOM element.
   * 💡 Hint: dispatch is passed as an empty function to the AppContextProvider, will be correctly replaced in the Apps component.
   */
  public render(): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noOpDispatch: React.Dispatch<AppsActions> = () => { };
    const appContext = new AppContext(
      this.context,
      this.logger,
      this.pageLanguage,
      initialAppsState
    );

    const element: React.ReactElement = React.createElement(
      AppContextProvider,
      { appContext, dispatch: noOpDispatch },
      React.createElement(Apps)
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: []
        }
      ]
    };
  }
}
