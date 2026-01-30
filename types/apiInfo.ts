import {ApiName, ApiUrl} from "../data/data";

export type ApiInfo = {
    id: number,
    title: ApiName
    url: ApiUrl,
    isIgnore?: boolean,
}
