export default class Urls{
    readonly urls: string[]
    readonly apis: string[]

    constructor() {
        this.urls = [
            'https://api-portfolio-62yp.onrender.com'
        ]

        this.apis = [
            'Portfolio'
        ]
    }

    getUrl(id: number) {
        return this.urls[id]    
    }

    getApi(id: number) {
        return this.apis[id]
    }
}