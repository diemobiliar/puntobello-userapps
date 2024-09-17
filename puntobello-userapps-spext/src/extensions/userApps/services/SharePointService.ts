// SPFx-specific imports
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";

// PnP JS imports
import { SPFI, spfi, SPFx } from "@pnp/sp";
import { Web } from "@pnp/sp/presets/all";

// Utilities
import { Utility } from "../utils/utils";

// Models
import IAllAppsItems from "../models/IAllAppsItems";


/**
 * Interface for the SharePoint service that defines the methods available 
 * for retrieving apps and user app IDs.
 */
export interface ISharePointService {
    /**
     * Retrieves a list of all applications available in the SharePoint site.
     * The results are filtered based on the provided culture.
     * 
     * @param {string} culture - The culture identifier used to filter the apps.
     * @returns {Promise<IAllAppsItems[]>} A promise that resolves to an array of all apps items.
     */
    getAllApps(culture: string): Promise<IAllAppsItems[]>;

    /**
     * Retrieves a list of application IDs that are associated with the current user.
     * 
     * @returns {Promise<string[]>} A promise that resolves to an array of application IDs.
     */
    getUserAppsIds(): Promise<string[]>;
}

/**
 * SharePointService provides methods to interact with SharePoint data,
 * specifically for retrieving all apps and user-specific apps.
 */
export class SharePointService {
    /**
     * A static service key used for consuming this service within SPFx.
     */
    public static readonly serviceKey: ServiceKey<ISharePointService> =
        ServiceKey.create<ISharePointService>('SPFx:SharePointService', SharePointService);

    private sp: SPFI;
    private appsSiteUrl: string;
    private userAppsRelativeUrl: string;
    private allAppsRelativeUrl: string;
    private userLoginName: string;

    /**
     * Initializes a new instance of the SharePointService class.
     * This constructor sets up the necessary context and initializes properties for interacting with SharePoint.
     * 
     * @param {ServiceScope} serviceScope - The service scope used to consume other SPFx services.
     */
    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this.allAppsRelativeUrl = Utility.getPBConfigUrl(true) + Utility.getAllAppsUrl();
            this.userAppsRelativeUrl = Utility.getPBConfigUrl(true) + Utility.getUserAppsUrl();
            this.appsSiteUrl = "https://" + Utility.getPBConfigUrl(false);
            this.userLoginName = pageContext.legacyPageContext.userLoginName;
            this.sp = spfi().using(SPFx({ pageContext: pageContext }));
        });
    }

    /**
     * Retrieves a list of all applications available in the SharePoint site.
     * The results are filtered based on the provided culture.
     * 
     * @param {string} culture - The culture identifier used to filter the apps.
     * @returns {Promise<IAllAppsItems[]>} A promise that resolves to an array of all apps items.
     */
    public getAllApps = async (culture: string): Promise<IAllAppsItems[]> => {
        const queryFilter = culture.length > 0 ?
            "pb_MUILanguage eq '" + culture + "' or pb_MUILanguage eq 'Default'" :
            "pb_MUILanguage eq 'default'";
        return Web([this.sp.web, this.appsSiteUrl]).getList(`${this.allAppsRelativeUrl}`).items.filter(queryFilter)();
    }

    /**
     * Retrieves a list of application IDs that are associated with the current user.
     * 
     * @returns {Promise<string[]>} A promise that resolves to an array of application IDs.
     */
    public getUserAppsIds = async (): Promise<string[]> => {
        const web = Web([this.sp.web, this.appsSiteUrl]);
        const user = await web.ensureUser(this.userLoginName);
        const listItem = await web
            .getList(this.userAppsRelativeUrl)
            .items
            .select('pb_UserApps')
            .filter(`pb_User eq '${user.data.Id}'`)
            .top(1)();
        if (listItem.length === 1 && listItem[0].pb_UserApps) {
            return listItem[0].pb_UserApps.split(';');
        }
        return [];
    }
}

