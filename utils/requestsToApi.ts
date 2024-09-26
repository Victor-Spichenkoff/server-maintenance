import axios, { AxiosError } from "axios"
import Urls from "../functions/urls"

const data = new Urls()

/**
 * 
 * 
 * @returns 1 (sucesso) ou 0 (erro de timeout 5s ou outro)
 */
export const makeOneRequest = async (url: string, name: string="", erros: string[], timeOut=10_000) => {
    if (process.env.NOT_REQ != "true")
        return [ 1, 0 , 0 ]


    try {
        const res = await axios(url + "/teste", {
            timeout: timeOut
        })
    
        if(res.status < 300) {
            return 1
        }

        erros?.push(name)
        return 0
    } catch(e) {
        const error = e as AxiosError//erro aqui
        console.log(error.message)
        console.log("⬆️ Erro ao fazer 1 requeset para "+ url)
        erros?.push(name)
        return 0
    }
}


export const isAllWorking = async (errorsList: string[]) => {
    const urls = data.urls
    let successUrlsCount = 0

    let results: any[] = [1]//lidar com erro de inexistente

    results = await Promise.all(urls.map(async (url, i) => {
        return await makeOneRequest(url, data.getApi(i), errorsList)
    }))

    results.forEach(result => successUrlsCount += result)

    if(successUrlsCount >= urls.length)
        return true

    return false
}
