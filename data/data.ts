/*
* Things related directly typing and reuse of basic data
* API Names
* API URLs
* */



import {Server} from "@prisma/client";

export type ApiName = typeof ApiNames[keyof typeof ApiNames]


export const ApiNames = {
    portfolios: 'Portfolios Api',
    articles: 'VSS Articles',
    shoppingList: 'Shopping List',
    pagination: 'Pagination',
    z: "Z",
    ticTacToe: "Tic Tac Toe",
    million: "Million",
    all: "All",
    nothing: "Nothing Selected",
} as const


// export const
export const ApiUrls = {
    portfolios:'https://portfolio-api-i3t0.onrender.com',
    articles: 'https://vss-artigos-backend.onrender.com',
    shoppingList : 'https://lista-mercado-api.onrender.com',
    pagination: 'https://pagination-api-ugwo.onrender.com',
    z: 'https://z-backend-t3zn.onrender.com',
    ticTacToe: 'https://tic-tac-toe-online-backend-jjv9.onrender.com',
    million: 'https://million-show-api.onrender.com',
    all: 'ALL.com',
    nothing: 'https://google.com',
} as const

export type ApiUrl = typeof ApiUrls[keyof typeof ApiUrls]



/*
* Important IDs for operations
* * All
* * Nothing Selected
* */
export const ApiOperationsIds = {
    all: 1717,
    nothing: 9999,
}

/*
* All Basic services data
* Cant update from here: label, shortLabel, fullUrl
* */
export const serverSeedData: CreateServerEntity[] = [
    {
        id: 1,
        label: "Million Show",
        fullUrl: "https://million-show-api.onrender.com/teste",
        shortLabel: "Million",
        isMain: true,
        isShowOnQuickActions: true,
    },
    {
        id: 2,
        label: "Online Tic Tac Toe",
        shortLabel: "Tic Tac",
        fullUrl: "https://tic-tac-toe-online-backend-jjv9.onrender.com/teste",
        isMain: true,
        isShowOnQuickActions: true,
    },
    {
        id: 3,
        label: "Pagination API",
        shortLabel: "Pagination",
        fullUrl: "https://pagination-api-ugwo.onrender.com/teste",
        isMain: true,
        isShowOnQuickActions: true,
    },
    {
        id: 4,
        label: "Z",
        shortLabel: "Z",
        fullUrl: "https://z-backend-t3zn.onrender.com/teste",
        isMain: true,
        isShowOnQuickActions: true,
    },
    {
        id: 5,
        label: "Share Portfolios",
        shortLabel: "Portfolios",
        fullUrl: "https://portfolio-api-i3t0.onrender.com/teste",
        isMain: false,
        isShowOnQuickActions: true,
    },
    {
        id: 6,
        label: "VSS Articles",
        shortLabel: "Articles",
        fullUrl: "https://vss-artigos-backend.onrender.com/teste",
        isMain: false
    },

    {
        id: 7,
        label: "Shopping List",
        shortLabel: "Shopping",
        fullUrl: "https://lista-mercado-api.onrender.com/teste",
        isMain: false
    },
]


type CreateServerEntity = {
    id: number
    label: string
    fullUrl: string
    shortLabel: string
    isMain: boolean,
    isShowOnQuickActions?: boolean,
}
