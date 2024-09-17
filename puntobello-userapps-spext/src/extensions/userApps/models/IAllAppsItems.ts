import { IItems } from "@pnp/sp/items";

export default interface IAllAppsItems extends IItems {
  Title?: string;
  pb_MUILanguage: string;
  pb_AppId: string;
  pb_LinkUrl: string;
}