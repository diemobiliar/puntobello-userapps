import { IRootEnv } from "../models";

let rootEnv: IRootEnv | null = null;

/**
 * Retrieves the root environment configuration settings, including CSS variables and SharePoint configuration.
 * The configuration is lazily initialized and cached for future use.
 * 
 * @returns {IRootEnv} The root environment configuration object containing CSS variables and SharePoint configuration settings.
 * 
 * @example
 * const env = getRootEnv();
 * console.log(env.css['--spfx_color_primary']); // Output: The primary UI color defined in the environment
 */
export const getRootEnv = (): IRootEnv => {
    if (!rootEnv) {
        // Lazily initialize the root environment configuration if it hasn't been initialized yet
        rootEnv = {
            css: {
                '--spfx_color_callout_font': process.env.SPFX_COLOR_CALLOUT_FONT,
                '--spfx_color_widget_text': process.env.SPFX_COLOR_WIDGET_TEXT,
                '--spfx_color_primary': process.env.SPFX_COLOR_PRIMARY,
                '--spfx_apps_fluentui_iconname': process.env.SPFX_APPS_FLUENTUI_ICONNAME,
                '--spfx_border_radius': process.env.SPFX_BORDER_RADIUS,
                '--spfx_font_family': process.env.SPFX_FONT_FAMILY,
                '--spfx_font_size_generic': process.env.SPFX_FONT_SIZE_GENERIC,
                '--spfx_font_size_title': process.env.SPFX_FONT_SIZE_TITLE,
            },
            config: {
                spfxConfigSite: process.env.SPFX_SITE_CONFIG,
                spfxUserAppsList: process.env.SPFX_LIST_USERAPPS,
                spfxAppsList: process.env.SPFX_LIST_APPS,
                spfxManagementAppsPage: process.env.SPFX_PAGE_MANAGEMENT_APPS,
            }
        };
    }
    return rootEnv;
};
