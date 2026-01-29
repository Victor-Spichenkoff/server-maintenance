import { ApiName } from "../../types/data"
import {apisInfo} from "../../data/apisInfo";

// export default class Urls{
//     readonly urls: string[]
//     readonly apis: ApiName[]
//     readonly ignoreIndex: number[]
//
//     constructor() {
//         this.urls = apisInfo.map(x => x.url)
//         // this.urls = [
//         //     'https://portfolio-api-i3t0.onrender.com',//0
//         //     'https://vss-artigos-backend.onrender.com',
//         //     'https://lista-mercado-api.onrender.com',
//         //     'https://pagination-api-ugwo.onrender.com',
//         //     "https://z-backend-t3zn.onrender.com",
//         //     "https://tic-tac-toe-online-backend-jjv9.onrender.com",
//         //     "https://million-show-api.onrender.com",//6
//         // ]
//
//         this.apis = apisInfo.map(x => x.title)
//
//         this.ignoreIndex = [1, 2]
//     }
//
//     getUrl(id: number) {
//         return this.urls[id]
//     }
//
//     getApi(index: number) {
//         return this.apis[index]
//     }
//
//     getApiIdByName(name: ApiName) {
//         return this.apis.findIndex((apiName) => apiName == name)
//     }
//
//     getApiUrlById(id: number) {
//         return this.urls[id]
//     }
//
// }
