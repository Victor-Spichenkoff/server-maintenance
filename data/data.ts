// export type ApiName = 'Portfolios Api' | 'VSS Articles'
//     | 'Shopping List' | 'Pagination' | "All" | "Z"//TODO CHANGE all -> all
//     | "Tic Tac Toe" | "Million" | "Nothing Selected"

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
