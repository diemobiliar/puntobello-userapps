export interface IAppsItem {
    id: string;
    name: string;
    description?: string;
    url?: string;
    order?: number;
    pinned?: boolean;
    unpinned?: boolean;
}