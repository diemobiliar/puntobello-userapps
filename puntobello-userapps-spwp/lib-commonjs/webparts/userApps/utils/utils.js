"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
var envconfig_1 = require("./envconfig");
var logger_1 = require("./logger");
/**
 * A utility class that provides various helper functions related to URL generation,
 * SharePoint configurations, and localization.
 */
var Utility = /** @class */ (function () {
    function Utility() {
    }
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
    Utility.getTenantName = function (urlString) {
        var url = new URL(urlString);
        var hostname = url.hostname; // Gets 'tenantname.sharepoint.com'
        return hostname.split('.')[0]; // Splits the hostname and takes the first part
    };
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
    Utility.getPBConfigUrl = function (relative) {
        if (relative) {
            return "/sites/" + this.rootEnv.config.spfxConfigSite;
        }
        else {
            return this.getTenantName(window.location.href) + ".sharepoint.com/sites/" + this.rootEnv.config.spfxConfigSite;
        }
    };
    /**
     * Gets the relative URL for the user applications list.
     *
     * @returns {string} The relative URL for the user apps list.
     *
     * @example
     * const userAppsUrl = Utility.getUserAppsUrl();
     * console.log(userAppsUrl); // Output: /Lists/UserAppsListName
     */
    Utility.getUserAppsUrl = function () {
        return "/Lists/" + this.rootEnv.config.spfxUserAppsList;
    };
    /**
     * Gets the relative URL for the all applications list.
     *
     * @returns {string} The relative URL for the all apps list.
     *
     * @example
     * const allAppsUrl = Utility.getAllAppsUrl();
     * console.log(allAppsUrl); // Output: /Lists/AllAppsListName
     */
    Utility.getAllAppsUrl = function () {
        return "/Lists/" + this.rootEnv.config.spfxAppsList;
    };
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
    Utility.getStringTranslation4Locale = function (stringName, locale) {
        try {
            var translatedString = require("../loc/".concat(locale, ".js"));
            return translatedString[stringName];
        }
        catch (_a) {
            try {
                var defaultString = require("../loc/default.js");
                return defaultString[stringName];
            }
            catch (defaultError) {
                logger_1.Logger.getInstance().error('Failed to load default language file', defaultError);
                return "Error: Missing translation file for ".concat(locale, " and default locale");
            }
        }
    };
    /**
     * The environment configuration settings for the application.
     * This includes information such as site URLs, list URLs, and other configuration details.
     * @private
     */
    Utility.rootEnv = (0, envconfig_1.getRootEnv)();
    return Utility;
}());
exports.Utility = Utility;
//# sourceMappingURL=utils.js.map