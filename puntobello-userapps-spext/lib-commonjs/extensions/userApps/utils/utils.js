"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
// Utility functions and environment configurations
var envconfig_1 = require("./envconfig");
var logger_1 = require("./logger");
// Fluent UI utilities
var react_1 = require("@fluentui/react");
/**
 * Utility class providing various helper methods for the application.
 * This class includes methods for URL generation, string translations,
 * and color manipulation, among others.
 */
var Utility = /** @class */ (function () {
    function Utility() {
    }
    /**
     * Extracts the tenant name from a given URL string.
     *
     * @private
     * @param {string} urlString - The URL string from which to extract the tenant name.
     * @returns {string} The tenant name extracted from the URL.
     */
    Utility.getTenantName = function (urlString) {
        var url = new URL(urlString);
        var hostname = url.hostname; // Gets 'tenantname.sharepoint.com'
        return hostname.split('.')[0]; // Splits the hostname and takes the first part
    };
    /**
     * Generates the SharePoint configuration site URL.
     *
     * @param {boolean} relative - If true, returns a relative URL; otherwise, returns an absolute URL.
     * @returns {string} The configuration site URL.
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
     * Returns the URL for the User Apps list.
     *
     * @returns {string} The User Apps list URL.
     */
    Utility.getUserAppsUrl = function () {
        return "/Lists/" + this.rootEnv.config.spfxUserAppsList;
    };
    /**
     * Returns the URL for the All Apps list.
     *
     * @returns {string} The All Apps list URL.
     */
    Utility.getAllAppsUrl = function () {
        return "/Lists/" + this.rootEnv.config.spfxAppsList;
    };
    /**
     * Returns the URL for the Management Apps page.
     *
     * @returns {string} The Management Apps page URL.
     */
    Utility.getManagementAppsUrl = function () {
        return "/SitePages/" + this.rootEnv.config.spfxManagementAppsPage;
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
     * Converts a hex color code to an RGBA string with the specified alpha value.
     *
     * @param {string} hex - The hex color code to convert.
     * @param {number} [alpha=100] - The alpha value to apply (0 to 100).
     * @returns {string} The RGBA color string.
     */
    Utility.hexToRGBA = function (hex, alpha) {
        if (alpha === void 0) { alpha = 100; }
        var color = (0, react_1.getColorFromString)(hex);
        if (color) {
            var colorWithAlpha = (0, react_1.updateA)(color, alpha);
            return colorWithAlpha.str;
        }
        return hex;
    };
    // Root environment configuration loaded from envConfig
    Utility.rootEnv = (0, envconfig_1.getRootEnv)();
    return Utility;
}());
exports.Utility = Utility;
//# sourceMappingURL=utils.js.map