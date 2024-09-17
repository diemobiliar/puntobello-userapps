// SPFx-specific imports
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";

// PnP JS imports
import { SPFI, spfi, SPFx } from "@pnp/sp";
import { Web } from "@pnp/sp/presets/all";

// Models
import { IAppsItem, IPageContext, IUserAppsItems, ILanguageRepresentation } from "../models";

// Utilities
import { Utility, Logger } from "../utils";
import * as lcid from "lcid";

/**
 * Interface defining the contract for SharePoint services used within the application.
 */
export interface ISharePointService {
    /**
     * Retrieves all applications available in the specified culture.
     * 
     * @param {string} culture - The culture code to filter applications (e.g., "en-US").
     * @returns {Promise<IAppsItem[]>} A promise that resolves to a list of applications.
     */
    getAllApps(culture: string): Promise<IAppsItem[]>;

    /**
     * Retrieves the IDs of the user's applications based on their user ID and login name.
     * 
     * @param {string} userId - The ID of the user in SharePoint.
     * @param {string} loginName - The login name of the user.
     * @param {IAppsItem[]} allApps - The list of all available applications.
     * @returns {Promise<string[]>} A promise that resolves to a list of application IDs.
     */
    getUserAppsIds(userId: string, loginName: string, allApps: IAppsItem[]): Promise<string[]>;

    /**
     * Updates the user's application list in SharePoint based on the ordered items provided.
     * 
     * @param {string} userObjectId - The object ID of the user in SharePoint.
     * @param {string} loginName - The login name of the user.
     * @param {string[]} orderedItems - The ordered list of application IDs.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    updateUserApps(userObjectId: string, loginName: string, orderedItems: string[]): Promise<void>;

    /**
     * Calculates the language settings for the current page based on the list and item IDs.
     * 
     * @param {string} listId - The ID of the SharePoint list.
     * @param {number} listItemId - The ID of the list item.
     * @param {number} defaultLanguage - The default language LCID if no language is found.
     * @returns {Promise<ILanguageRepresentation>} A promise that resolves to the language representation.
     */
    calculateLanguage(listId: string, listItemId: number, defaultLanguage: number): Promise<ILanguageRepresentation>;
}

/**
 * Implementation of the ISharePointService interface for interacting with SharePoint.
 * This class provides methods for retrieving and updating user applications, as well as calculating language settings.
 */
export default class SharePointService {
    /**
     * The ServiceKey used to register this service within the SharePoint framework's service scope.
     */
    public static readonly serviceKey: ServiceKey<ISharePointService> =
        ServiceKey.create<ISharePointService>('SPFx:SharePointService', SharePointService);

    private appsSiteUrl: string;
    private userAppsRelativeUrl: string;
    private allAppsRelativeUrl: string;
    private sp: SPFI;
    private logger: Logger;

    /**
     * Initializes a new instance of the SharePointService class.
     * 
     * @param {ServiceScope} serviceScope - The service scope from which the SharePoint context and other services are consumed.
     */
    constructor(serviceScope: ServiceScope) {
        this.logger = Logger.getInstance();

        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this.allAppsRelativeUrl = Utility.getPBConfigUrl(true) + Utility.getAllAppsUrl();
            this.userAppsRelativeUrl = Utility.getPBConfigUrl(true) + Utility.getUserAppsUrl();
            this.appsSiteUrl = "https://" + Utility.getPBConfigUrl(false);
            this.sp = spfi().using(SPFx({ pageContext: pageContext }));
        });
    }

    /**
     * Calculates the language settings for the current page based on the list and item IDs.
     * 
     * @param {string} listId - The ID of the SharePoint list.
     * @param {number} listItemId - The ID of the list item.
     * @param {number} defaultLanguage - The default language LCID if no language is found.
     * @returns {Promise<ILanguageRepresentation>} A promise that resolves to the language representation.
     */
    public calculateLanguage = async (listId: string, listItemId: number, defaultLanguage: number): Promise<ILanguageRepresentation> => {
        let pageContext = null;
        const languageData: ILanguageRepresentation = {
            lcid: 0, 
            Language: '',
            LanguageLC: '',
            LanguageDashed: '',
            LanguageDashedLC: '',
        };

        try {
            pageContext = await this.getPageContext(listId, listItemId);
        } catch (error) {
            this.logger.info("calculateLanguage, getPageContext returned an error, probably not running in a multilingual setup, defaulting to web language", error);
        }

        if (!pageContext || !pageContext.OData__SPIsTranslation || !pageContext.OData__SPTranslationLanguage) {
            // If not running in a multilingual setup, default to the web language
            languageData.lcid = defaultLanguage;
            languageData.Language = lcid.from(defaultLanguage);
            languageData.LanguageLC = languageData.Language.toLowerCase();
            languageData.LanguageDashed = languageData.Language.replace('_','-');
            languageData.LanguageDashedLC = languageData.LanguageLC.replace('_','-');
            return languageData;
        }

        // If the page is a translation, get the language from the page property
        languageData.lcid = lcid.to(pageContext.OData__SPTranslationLanguage);
        languageData.Language = pageContext.OData__SPTranslationLanguage;
        languageData.LanguageLC = languageData.Language.toLowerCase();
        languageData.LanguageDashed = languageData.Language.replace('_','-');
        languageData.LanguageDashedLC = languageData.LanguageLC.replace('_','-');
        return languageData;
    }

    /**
     * Retrieves all applications available in the specified culture.
     * 
     * @param {string} culture - The culture code to filter applications (e.g., "en-US").
     * @returns {Promise<IAppsItem[]>} A promise that resolves to a list of applications.
     */
    public getAllApps = async (culture: string): Promise<IAppsItem[]> => {
        const queryFilter = culture.length > 0 ?
        "pb_MUILanguage eq '" + culture + "' or pb_MUILanguage eq 'Default'" :
        "pb_MUILanguage eq 'default'";

        const allApps = await Web([this.sp.web, this.appsSiteUrl]).getList(this.allAppsRelativeUrl).items.filter(queryFilter)();

        // Sort so that the user's language comes first, then the default
        allApps.sort((a, b) => {
            if (a.pb_MUILanguage === culture && b.pb_MUILanguage !== culture) {
                return -1; 
            } else if (a.pb_MUILanguage !== culture && b.pb_MUILanguage === culture) {
                return 1; 
            }
            return 0; 
        });

        // Remove duplicate applications based on pb_AppId
        const seenIds = new Set();
        const filteredApps = allApps.filter((app) => {
            if (!seenIds.has(app.pb_AppId)) {
                seenIds.add(app.pb_AppId);
                return true;
            }
            return false; // duplicate
        });

        // Map the filtered applications to IAppsItem format
        return filteredApps.map((app: IUserAppsItems) => ({
            id: app.pb_AppId,
            name: app.Title,
            description: app.pb_Description,
            url: app.pb_LinkUrl,
            order: app.pb_SortOrder
        })) as IAppsItem[];
    }

    /**
     * Retrieves the IDs of the user's applications based on their user ID and login name.
     * 
     * @param {string} userId - The ID of the user in SharePoint.
     * @param {string} loginName - The login name of the user.
     * @param {IAppsItem[]} allApps - The list of all available applications.
     * @returns {Promise<string[]>} A promise that resolves to a list of application IDs.
     */
    public getUserAppsIds = async (userId: string, loginName: string, allApps: IAppsItem[]): Promise<string[]> => {
        const web = Web([this.sp.web, this.appsSiteUrl]);
        const user = await web.ensureUser(loginName);
        const listItem = await web
            .getList(this.userAppsRelativeUrl)
            .items
            .select('pb_UserApps')
            .filter(`pb_User eq '${user.data.Id}'`)
            .top(1)();

        if (listItem.length === 1 && listItem[0].pb_UserApps) {
            const myAppIds: string[] = listItem[0].pb_UserApps.split(';');
            // Check if any app has been removed from the list and update accordingly
            const filteredAppIds = myAppIds.filter((myAppId: string) => {
                return allApps.find(allApp => allApp.id === myAppId);
            });

            if (myAppIds.length !== filteredAppIds.length) {
                await this.updateUserApps(userId, loginName, filteredAppIds);
            }

            return filteredAppIds;
        }
        return [];
    }

    /**
     * Updates the user's application list in SharePoint based on the ordered items provided.
     * 
     * @param {string} userId - The object ID of the user in SharePoint.
     * @param {string} loginName - The login name of the user.
     * @param {string[]} orderedItems - The ordered list of application IDs.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    public updateUserApps = async (userId: string, loginName: string, orderedItems: string[]): Promise<void> => {
        const list = Web([this.sp.web, this.appsSiteUrl]).getList(this.userAppsRelativeUrl);

        const listItem = await list
            .items
            .select('Id')
            .filter(`pb_User eq '${userId}'`)
            .top(1)();

        if (listItem.length === 1) {
            await list.items.getById(listItem[0].Id).update({
                pb_UserApps: orderedItems.join(';'),
            });
        } else if (listItem.length === 0) {
            const user = await Web([this.sp.web, this.appsSiteUrl]).ensureUser(loginName);

            await list.items.add({
                pb_UserId: user.data.Id,
                pb_UserApps: orderedItems.join(';'),
            });
        }
    }

    /**
     * Retrieves the page context for a specified list and item ID.
     * 
     * @param {string} listId - The ID of the SharePoint list.
     * @param {number} listItemId - The ID of the list item.
     * @returns {Promise<IPageContext>} A promise that resolves to the page context containing relevant metadata.
     */
    private getPageContext = async (listId: string, listItemId: number): Promise<IPageContext> => {
        const context: IPageContext = await this.sp.web.lists.getById(listId)
            .items
            .getById(listItemId)
            .select(
                'OData__SPIsTranslation',
                'OData__SPTranslationLanguage',
                'OData__SPTranslationSourceItemId')();
        return context;
    }
}

