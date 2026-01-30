import { Request, RequestHandler, Response } from "express"
import { sendTelegramMensage } from "../lib/sendToPhone"
// import Urls from "../functions/urls"
import { isAllWorking, makeOneRequest } from "../utils/requestsToApi"
import axios from "axios"
import {ApiRepository} from "../services/ApiRepository.service";
import {TimeRepository} from "../services/TimeRepository.service";
import {allApisUrls, apisInfo, getApiInfoById, onlyAllowedToCallApiUrls} from "../data/apisInfo";

// const data = new Urls()



export async function forceLoadAllOnce(req: any, res: any) {
    const errorsNames: string[] = []
    const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let finish = false

    await sendTelegramMensage("Iniciando Req de todos")


    await Promise.all(ten.map(async () => {
        if (finish)
            return

        const isAllCorrect = await isAllWorking(errorsNames)

        if (isAllCorrect)
            finish = true
    }))


    if (finish)
        return sendTelegramMensage("Todas funcionando!")


    await sendTelegramMensage("[Forçar] Erro no req de todos - 10 vezes")
}

export async function setOne(req: Request, res: any) {
    const id: any = Number(req.params.id)
    if(id >= apisInfo.length || id < 0)
        return res.status(400).send("Invalid ID")

    let apiInfo = apisInfo.filter(x => x.id == id)[0]

    await ApiRepository.setToOne(id, apiInfo.title, apiInfo.url)
    await TimeRepository.setKeepThisOn()

    await sendTelegramMensage('Setado para: ' + (apiInfo.title).toUpperCase())

    res.sendStatus(200)
}

export async function setAll(res: Response) {
    await ApiRepository.setToAll()
    await TimeRepository.setKeepThisOn()


    await sendTelegramMensage('Setado para TODOS')
    res.send('Setado para todos')
}


export async function turnOff(req?: Request, res?: Response) {
    await ApiRepository.turnApiOff()

    await sendTelegramMensage('Tudo OFF')
    res?.send("Tudo OFF")
}

/**
 * * Demora 10 segundos cada (vai ter 5, OLX == ultima atualização)
 */
export const callAllOnce: RequestHandler = async (req, res) => {
    const urls = allApisUrls//data.urls
    const errorsNames: string[] = []
    let successUrlsCount = 0


    let results: any[] = [1, 1, 1, 1]

    results = await Promise.all(urls.map(async (url, i) => {
        return await makeOneRequest(url, getApiInfoById(i)?.title, errorsNames)
    }))


    results.forEach(result => successUrlsCount += result)

    res.send({
        isAllWorking: successUrlsCount >= urls.length,
        working: successUrlsCount,
        total: urls.length,
        errors: errorsNames
    })
}


//ele deve ter uma resposta mais simples (usar no de forçar)
//no forçar, o front cuida de fazer várias reqs, aqui, só retornar true ou false
export const callAllOnceSimpleAndIgnore: RequestHandler = async (req, res) => {
    const urls = onlyAllowedToCallApiUrls
    const errorsNames: string[] = []

    let successUrlsCount = 0

    let results: any[] = [1, 0, 0]
    if (process.env.NOT_REQ != "true") {
        results = await Promise.all(urls.map(async (url, i) => {
            if(getApiInfoById(i)?.isIgnore)
                return
            return await makeOneRequest(url, getApiInfoById(i)?.title, errorsNames, 4_000)
        }))
    }


    results.forEach(result => successUrlsCount += result)

    res.send({
        isAllWorking: successUrlsCount == urls.length,
        working: successUrlsCount,
    })
}


/**
 *
 * * Vai retornar o Nome dele ou um Status 500
 */
export const testOne: RequestHandler = async (req, res) => {
    const { id } = req.params
    const api = getApiInfoById(Number(id))

    const url = api?.url
    console.log(url)
    try {
        if (process.env.NOT_REQ != "true") {
            await axios(url + "/teste", { timeout: 7_000 })

            res.send(`${api?.title}`)
        }
        else {
            setTimeout(() => {
                res.send(api?.title + "[FAKE]")
            }, 5000)
        }

    } catch {
        res.status(500).send("Tempo excedido")
    }
}
