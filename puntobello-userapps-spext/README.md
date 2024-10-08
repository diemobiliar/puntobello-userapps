# User Apps extension

## Summary
This application customizer displays all favorited applications in the header of a SharePoint site, providing quick access to the user's most-used apps.  

![User Apps Extension](../assets/myapps-header-extention.png)

### Features
The user gets a small widget that, when clicked, opens a menu displaying the following information:
- A list of apps in the order the user has defined.
- A link to the management page, where the user can manage (pin/unpin/sort) their favorite applications.

This SPFx solution is to be used with [PuntoBello User Apps Webpart](../puntobello-userapps-spwp/README.md).

### Parameters
You can configure all the parameters in the corresponding files located in the `env` directory. Once set, build the solution accordingly.

| Parameter                              | Description                                                              |
|----------------------------------------|--------------------------------------------------------------------------|
| SPFX_COLOR_CALLOUT_FONT                | The color used for fonts in callout elements.                             |
| SPFX_COLOR_WIDGET_TEXT                 | The color used for text in widget elements.                               |
| SPFX_COLOR_PRIMARY                     | The primary color used throughout the application.                       |
| SPFX_APPS_FLUENTUI_ICONNAME            | The default Fluent UI icon name for application icons.                   |
| SPFX_FONT_FAMILY                       | The font family used across the application.                             |
| SPFX_FONT_SIZE_GENERIC                 | The standard font size used for general text.                            |
| SPFX_FONT_SIZE_TITLE                   | The font size used specifically for titles and headings.                 |
| SPFX_BORDER_RADIUS                     | Border radius applied to elements                                        |
| SPFX_SITE_CONFIG                       | Configuration setting related to site-specific parameters.               |
| SPFX_LIST_USERAPPS                     | List identifier for user applications.                                   |
| SPFX_LIST_APPS                         | List identifier for general applications.                                |
| SPFX_PAGE_MANAGEMENT_APPS              | Page name used for managing user applications.                           |


### _Note_
* Uses PnP-Js library for all rest interactions with sharepoint.

## Compatibility
![SPFx 1.18.2](https://img.shields.io/badge/SPFx-1.18.2-green.svg)
![Node.js v18.19.1](https://img.shields.io/badge/Node.js-%20v18.19.1-green.svg) 
![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-green.svg)
![Teams N/A: Untested with Microsoft Teams](https://img.shields.io/badge/Teams-N%2FA-lightgrey.svg "Untested with Microsoft Teams") 
![Local Workbench](https://img.shields.io/badge/Workbench-Local-red.svg)
![Workbench Hosted](https://img.shields.io/badge/Workbench-Hosted-red.svg)

## Solution

Solution|Author(s)
--------|---------
puntobello-userapps-spext | Nello D'Andrea, die Mobiliar

## Version history

Version|Date|Comments
-------|----|--------
1.0.0|September 2024|Initial release

## License
[MIT License](../LICENSE.md)

## Acknowledgment Request

If you find this software useful and incorporate it into your own projects, especially for commercial purposes, we kindly ask that you acknowledge its use. This acknowledgment can be as simple as mentioning "Powered by Die Mobiliar - PuntoBello" in your product's documentation, website, or any related materials.

While this is not a requirement of the MIT License and is entirely voluntary, it helps support and recognize the efforts of the developers who contributed to this project. We appreciate your support!