import { ServiceScope } from "@microsoft/sp-core-library";
import { ILanguageRepresentation } from "./ILanguageRepresentation";

export interface IUserAppsProps {
  serviceScope: ServiceScope;
  loginName: string;
  pageLanguage: ILanguageRepresentation;
  userId: string;
}
