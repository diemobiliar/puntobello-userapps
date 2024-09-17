declare interface IUserAppsWebPartStrings {
  SearchBoxPlaceholder: string;
  AllApplicationsTitle: string;
  MyApplicationsTitle: string;
  NoApplicationsFound: string;
  NoApplicationsPinned: string;
  NoApplicationsAvailable: string;
  UnpinScreenreaderText: string;
  PinScreenreaderText: string;
  PropertyPaneDescription: string;
}

declare module 'UserAppsWebPartStrings' {
  const strings: IUserAppsWebPartStrings;
  export = strings;
}
