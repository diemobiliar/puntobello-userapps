// Utility functions and environment configurations
import { getRootEnv } from "./envconfig";
import { Logger } from "./logger";

// Fluent UI utilities
import { getColorFromString, updateA } from '@fluentui/react';

/**
 * Utility class providing various helper methods for the application.
 * This class includes methods for URL generation, string translations, 
 * and color manipulation, among others.
 */
export class Utility {
  // Root environment configuration loaded from envConfig
  private static rootEnv = getRootEnv();

  /**
   * Extracts the tenant name from a given URL string.
   * 
   * @private
   * @param {string} urlString - The URL string from which to extract the tenant name.
   * @returns {string} The tenant name extracted from the URL.
   */
  private static getTenantName(urlString: string): string {
    const url = new URL(urlString);
    const hostname = url.hostname; // Gets 'tenantname.sharepoint.com'
    return hostname.split('.')[0]; // Splits the hostname and takes the first part
  }

  /**
   * Generates the SharePoint configuration site URL.
   * 
   * @param {boolean} relative - If true, returns a relative URL; otherwise, returns an absolute URL.
   * @returns {string} The configuration site URL.
   */
  static getPBConfigUrl(relative: boolean): string {
    if (relative) {
      return "/sites/" + this.rootEnv.config.spfxConfigSite;
    } else {
      return this.getTenantName(window.location.href) + ".sharepoint.com/sites/" + this.rootEnv.config.spfxConfigSite;
    }
  }

  /**
   * Returns the URL for the User Apps list.
   * 
   * @returns {string} The User Apps list URL.
   */
  static getUserAppsUrl(): string {
    return "/Lists/" + this.rootEnv.config.spfxUserAppsList;
  }

  /**
   * Returns the URL for the All Apps list.
   * 
   * @returns {string} The All Apps list URL.
   */
  static getAllAppsUrl(): string {
    return "/Lists/" + this.rootEnv.config.spfxAppsList;
  }

  /**
   * Returns the URL for the Management Apps page.
   * 
   * @returns {string} The Management Apps page URL.
   */
  static getManagementAppsUrl(): string {
    return "/SitePages/" + this.rootEnv.config.spfxManagementAppsPage;
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

  /**
   * Converts a hex color code to an RGBA string with the specified alpha value.
   * 
   * @param {string} hex - The hex color code to convert.
   * @param {number} [alpha=100] - The alpha value to apply (0 to 100).
   * @returns {string} The RGBA color string.
   */
  static hexToRGBA(hex: string, alpha = 100): string {
    const color = getColorFromString(hex);
    if (color) {
      const colorWithAlpha = updateA(color, alpha);
      return colorWithAlpha.str;
    }
    return hex;
  }
}
