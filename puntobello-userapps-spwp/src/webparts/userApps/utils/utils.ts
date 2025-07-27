import { getRootEnv } from "./envconfig";
import { Logger } from "./logger";

/**
 * A utility class that provides various helper functions related to URL generation,
 * SharePoint configurations, and localization.
 */
export class Utility {
  /**
   * The environment configuration settings for the application.
   * This includes information such as site URLs, list URLs, and other configuration details.
   * @private
   */
  private static rootEnv = getRootEnv();

  /**
   * Extracts the tenant name from a given URL string.
   * 
   * @param {string} urlString - The full URL string from which to extract the tenant name.
   * @returns {string} The tenant name extracted from the URL.
   * 
   * @example
   * const tenantName = Utility.getTenantName("https://tenantname.sharepoint.com");
   * console.log(tenantName); // Output: tenantname
   * 
   * @private
   */
  private static getTenantName(urlString: string): string {
    const url = new URL(urlString);
    const hostname = url.hostname; // Gets 'tenantname.sharepoint.com'
    return hostname.split('.')[0]; // Splits the hostname and takes the first part
  }

  /**
   * Constructs the SharePoint configuration URL based on whether it is relative or absolute.
   * 
   * @param {boolean} relative - Whether to generate a relative URL or an absolute URL.
   * @returns {string} The constructed SharePoint configuration URL.
   * 
   * @example
   * const configUrl = Utility.getPBConfigUrl(true);
   * console.log(configUrl); // Output: /sites/configSiteName
   */
  static getPBConfigUrl(relative: boolean): string {
    if (relative) {
      return "/sites/" + this.rootEnv.config.spfxConfigSite;
    } else {
      return this.getTenantName(window.location.href) + ".sharepoint.com/sites/" + this.rootEnv.config.spfxConfigSite;
    }
  }

  /**
   * Gets the relative URL for the user applications list.
   * 
   * @returns {string} The relative URL for the user apps list.
   * 
   * @example
   * const userAppsUrl = Utility.getUserAppsUrl();
   * console.log(userAppsUrl); // Output: /Lists/UserAppsListName
   */
  static getUserAppsUrl(): string {
    return "/Lists/" + this.rootEnv.config.spfxUserAppsList;
  }

  /**
   * Gets the relative URL for the all applications list.
   * 
   * @returns {string} The relative URL for the all apps list.
   * 
   * @example
   * const allAppsUrl = Utility.getAllAppsUrl();
   * console.log(allAppsUrl); // Output: /Lists/AllAppsListName
   */
  static getAllAppsUrl(): string {
    return "/Lists/" + this.rootEnv.config.spfxAppsList;
  }

  /**
    * Retrieves a translated string based on the given string name and locale.
    * Attempts to load the translation from the locale-specific file first; 
    * if not found, falls back to the default locale file.
    * 
    * @param {string} stringName - The key/name of the string to translate.
    * @param {string} locale - The locale code to use for translation (e.g., "en-US").
    * @returns {string} The translated string or an error message if the translation is not found.
    * 
    * @example
    * const translatedString = Utility.getStringTranslation4Locale('WelcomeText', 'en-US');
    * console.log(translatedString); // Output: Welcome
    */
  static getStringTranslation4Locale(stringName: string, locale: string): string {
    try {
      const translatedString = require(`../loc/${locale}.js`);
      return translatedString[stringName];
    } catch {
      try {
        const defaultString = require(`../loc/default.js`);
        return defaultString[stringName];
      } catch (defaultError) {
        Logger.getInstance().error('Failed to load default language file', defaultError);
        return `Error: Missing translation file for ${locale} and default locale`;
      }
    }
  }
}