import {ApiInfo} from "../types/apiInfo";

export const apisInfo: ApiInfo[] = [
    {
        id: 0,
        title: 'Portfolios Api',
        url: 'https://portfolio-api-i3t0.onrender.com',
    },
    {
        id: 1,
        title: 'VSS Articles',
        url: 'https://vss-artigos-backend.onrender.com',
        isIgnore: true,
    },
    {
        id: 2,
        title: 'Shopping List',
        url: 'https://lista-mercado-api.onrender.com',
        isIgnore: true,
    },
    {
        id: 3,
        title: 'Pagination',
        url: 'https://pagination-api-ugwo.onrender.com',
    },
    {
        id: 4,
        title: 'Z',
        url: 'https://z-backend-t3zn.onrender.com',
        isIgnore: true,
    },
    {
        id: 5,
        title: 'Tic Tac Toe',
        url: 'https://tic-tac-toe-online-backend-jjv9.onrender.com'
    },
    {
        id: 6,
        title: 'Million',
        url: 'https://million-show-api.onrender.com'
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
export const idsToIgnore = [1, 2, 4]
