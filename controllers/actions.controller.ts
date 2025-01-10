import { Request, RequestHandler, Response } from "express"
import { sendTelegramMensage } from "../functions/sendToPhone"
import Urls from "../functions/urls"
import { setKeepApiOn } from "../utils/time"
import { write } from "../services/apis.service"
import { isAllWorking, makeOneRequest } from "../utils/requestsToApi"
import { selectTimer } from "../functions/schedule"
import axios from "axios"

const data = new Urls()



export async function forceLoadAllOnce(req: any, res: any) {
    const errorsNames: string[] = []
    const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let finsih = false

    sendTelegramMensage("Iniciando Req de todos")


    await Promise.all(ten.map(async () => {
        if (finsih)
            return

        const isAllCorrect = await isAllWorking(errorsNames)

        if (isAllCorrect)
            finsih = true
    }))


    if (finsih)
        return sendTelegramMensage("Todas funcionando!")


    sendTelegramMensage("[Forçar] Erro no req de todos - 10 vezes")
}

export async function setOne(index: number, res: any) {
    let url = data.getUrl(index)

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


    let results: any[] = [1, 1, 1, 1]

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

    let results: any[] = [1, 0, 0]
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


/**
 * 
 * * Vai retornar o Nome dele ou um Status 500
 */
export const testOne: RequestHandler = async (req, res) => {
    const { id } = req.params

    const url = data.getApiUrlById(Number(id))
    console.log(url)
    try {
        if (process.env.NOT_REQ != "true") {
            const respose = await axios(url + "/teste", { timeout: 7_000 })

            res.send(`${data.getApi(Number(id))}`)
        }
        else {
            setTimeout(() => {
                res.send(data.getApi(Number(id)) + "[FAKE]")
            }, 5000)
        }

    } catch {
        res.status(500).send("Tempo excedido")
    }
}