import { ApiName } from "../types/data"

export default class Urls{
    readonly urls: string[]
    readonly apis: ApiName[]
    readonly ignoreIndex: number[]

    constructor() {
        this.urls = [
            'https://portfolio-api-i3t0.onrender.com',
            'https://vss-artigos-backend.onrender.com',
            'https://lista-mercado-api.onrender.com',
            'https://pagination-api-ugwo.onrender.com',
            "https://z-backend-t3zn.onrender.com",
            "https://tic-tac-toe-online-backend-jjv9.onrender.com"
        ]

        this.apis = [
            'Portfolio Api',
            'VSS Artigos',
            'Lista Mercado',
            'Paginação',
            "Z",
            "Velha"
        ]

        this.ignoreIndex = [1, 2]
    }

    getUrl(id: number) {
        return this.urls[id]    
    }

    getApi(index: number) {
        return this.apis[index]
    }

    getApiIdByName(name: ApiName) {
        return this.apis.findIndex((apiName) => apiName == name)
    }

    getApiUrlById(id: number) {
        return this.urls[id]
    }

}