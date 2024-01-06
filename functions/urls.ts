export default class Urls{
    readonly urls: string[]
    readonly apis: string[]

    constructor() {
        this.urls = [
            'https://api-portfolio-62yp.onrender.com',
            'https://portfolio-api-i3t0.onrender.com',
            'https://vss-artigos-backend.onrender.com',
            'https://lista-mercado-api.onrender.com',
            'https://pagination-api-ugwo.onrender.com'

        ]

        this.apis = [
            'Api Portfolio',
            'Portfolio Api',
            'VSS Artigos',
            'Lista Mercado',
            'Paginação'
        ]
    }

    getUrl(id: number) {
        return this.urls[id]    
    }

    getApi(id: number) {
        return this.apis[id]
    }
}