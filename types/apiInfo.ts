import {ApiName} from "./data";

export type ApiInfo = {
    id: number,
    title: ApiName
    url: string,
    isIgnore?: boolean,
}
