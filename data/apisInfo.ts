import {ApiInfo} from "../types/apiInfo";
import { ApiNames, ApiUrls} from "./data";

/*
* Things related directly with the data
* */


export const apisInfo: ApiInfo[] = [
    {
        id: 0,
        title: ApiNames.portfolios,
        url: ApiUrls.portfolios
    },
    {
        id: 1,
        title: ApiNames.articles,
        url: ApiUrls.articles,
        isIgnore: true,
    },
    {
        id: 2,
        title: ApiNames.shoppingList,
        url: ApiUrls.shoppingList,
        isIgnore: true,
    },
    {
        id: 3,
        title: ApiNames.pagination,
        url: ApiUrls.pagination
    },
    {
        id: 4,
        title: ApiNames.z,
        url: ApiUrls.z,
        isIgnore: true,
    },
    {
        id: 5,
        title: ApiNames.ticTacToe,
        url: ApiUrls.ticTacToe
    },
    {
        id: 6,
        title: ApiNames.million,
        url: ApiUrls.million
    },
]

export const allApisUrls = apisInfo.map(x => x.url)

export const onlyAllowedToCallApiUrls = apisInfo.filter(x => x.isIgnore == false).map(x => x.url)

export const getApiInfoById = (id: number) => {
    return apisInfo.find(x => x.id === id)
}



/*
* Will ignore
* * Articles
* * Shopping list
* * Z
* */
// export const idsToIgnore = [1, 2, 4]

