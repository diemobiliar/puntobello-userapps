import { IAppsItem } from "../models";

export enum ActionType {
    SetSearchText,
    AddMyApp,
    UpdateMyApp,
    RemoveMyApp,
    SetUserApps,
    AddAllApp,
    UpdateAllApp,
    RemoveAllApp,
    AppsLoaded
}

export interface IAddMyApp {
    type: ActionType.AddMyApp;
    payload: IAppsItem;
}

export interface IUpdateMyApp {
    type: ActionType.UpdateMyApp;
    payload: IAppsItem;
}

export interface IRemoveMyApp {
    type: ActionType.RemoveMyApp;
    payload: IAppsItem;
}

export interface IAddAllApp {
    type: ActionType.AddAllApp;
    payload: IAppsItem;
}

export interface IUpdateAllApp {
    type: ActionType.UpdateAllApp;
    payload: IAppsItem;
}

export interface IRemoveAllApp {
    type: ActionType.RemoveAllApp;
    payload: IAppsItem;
}

export interface ISetSearchText {
    type: ActionType.SetSearchText;
    payload: string;
}

export interface IAppsLoaded {
    type: ActionType.AppsLoaded;
    payload: { allApps: IAppsItem[], userApps: IAppsItem[] };
}

export interface ISetUserApps {
    type: ActionType.SetUserApps;
    payload: IAppsItem[];
}

export type AppsActions = IAddMyApp | IUpdateMyApp | IRemoveMyApp | ISetUserApps | IAddAllApp | IUpdateAllApp | IRemoveAllApp | ISetSearchText | IAppsLoaded;