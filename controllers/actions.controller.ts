import { Request, RequestHandler, Response } from "express"
import { write } from "../functions/manegeData"
import { makeOneRequest, makeRecursiveRequest, selectTimer } from "../functions/schedule"
import { sendTelegramMensage } from "../functions/sendToPhone"
import Urls from "../functions/urls"
import { setKeepApiOn } from "../utils/time"

const data = new Urls()


//veio de schedule
export async function forceLoadAllOnce(req: any, res: any) {
    const urls = data.urls
    var successUrlsCount = 0
    var times = 0

    urls.forEach(async (url) => {
        const responseFromRecursive = await makeRecursiveRequest(false, url, successUrlsCount)
        successUrlsCount = Number(responseFromRecursive)
    })
    const interval = setInterval(() => {
        if (successUrlsCount >= urls.length) {
            res.send('Todas as reqs foram feitas')
            sendTelegramMensage('Todas as reqs foram feitas')
            clearInterval(interval)
        }
        times++
        if (times > 20) {
            res.send("Erro no req de todos")
            sendTelegramMensage('Erro no req de todos')
            clearInterval(interval)
        }
    }, 1000)
}


export async function setOne(index: number, res: any) {
    console.log('Index: ' + index)
    console.log('Nome: ' + data.getApi(index))

    let url = data.getUrl(index)

    // const resApi = await axios.get(url+'/teste')

    await write('currentMantenedUrl', url)
    await write('currentMantenedName', data.getApi(index))
    await write('off', false)

    sendTelegramMensage('Setado para: ' + (data.getApi(index)).toUpperCase())

    selectTimer()

    res.sendStatus(200)

    // if(typeof resApi.data == 'string') res.send('Tudo certo em: ' + data.getApi(index))
    // else res.status(500).send('Erro em ' + data.getApi(index))
}


export async function setAll(res: Response) {
    setKeepApiOn()
    await write('currentMantenedName', 'all')
    await write('off', false)

    selectTimer()

    sendTelegramMensage('Setado para TODOS')
    res.send('Setado para todos')
}





export async function turnOff(req?: Request, res?: Response) {
    await write('off', true)
    await write('currentMantenedUrl', 'https://google.com')
    await write('currentMantenedName', 'Nenhum Selecionado')

    sendTelegramMensage('Tudo OFF')
    res?.send("Tudo OFF")
}

/**
 * * Demora 10 segundos cada (vai ter 5, OLX == ultima atualização)
 */
export const callAllOnce: RequestHandler = async (req, res) => {
    const urls = data.urls
    const errorsNames: string[] = []
    let successUrlsCount = 0


    let results = [1, 1, 1, 1]
    if (process.env.NOT_REQ != "true")
        results = await Promise.all(urls.map(async (url, i) => {
            return await makeOneRequest(url, data.getApi(i), errorsNames)
        }))


    results.forEach(result => successUrlsCount += result)

    res.send({
        isAllWorking: successUrlsCount >= urls.length,
        working: successUrlsCount,
        total: urls.length,
        errors: errorsNames
    })
}


//ele deve ter uma resposta mais simlples (usar no de forçar)
//no forçar, o front cuida de fazer várias reqs, aqui, só retornar true ou false
export const callAllOnceSimple: RequestHandler = async (req, res) => {
    const urls = data.urls
    const errorsNames: string[] = []
    // const urls = ['https://portfolio-api-i3t0.onrender.com']
    let successUrlsCount = 0

    let results = [1, 0, 0]
    if (process.env.NOT_REQ != "true") {
        results = await Promise.all(urls.map(async (url, i) => {
            return await makeOneRequest(url, data.getApi(i), errorsNames, 4_000)
        }))
    }


    results.forEach(result => successUrlsCount += result)

    res.send({
        isAllWorking: successUrlsCount == urls.length,
        working: successUrlsCount,
    })
}