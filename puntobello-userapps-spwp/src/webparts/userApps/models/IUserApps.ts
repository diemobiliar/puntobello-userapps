import { IItems } from "@pnp/sp/items";

export interface IUserAppsItems extends IItems {
    Title?: string;
    pb_LinkUrl?: string;
    pb_AppId: string;
    pb_Description?: string;
    pb_SortOrder?: number; 
  }