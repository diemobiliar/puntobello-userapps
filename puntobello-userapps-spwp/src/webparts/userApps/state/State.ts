import { IAppsItem } from "../models";

export interface IAppsState {
    userApps: IAppsItem[];
    allApps: IAppsItem[];
    searchText: string;
    appsLoaded: boolean;
}

export const initialAppsState: IAppsState = {
    userApps: [],
    allApps: [],
    searchText: '',
    appsLoaded: false
};