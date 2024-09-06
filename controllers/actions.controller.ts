import { Request, Response } from "express"
import { write } from "../functions/manegeData"
import { makeRecursiveRequest, selectTimer } from "../functions/schedule"
import { sendTelegramMensage } from "../functions/sendToPhone"
import Urls from "../functions/urls"

const data = new Urls()


//veio de schedule
export async function forceLoadAllOnce(req:any, res:any) {
    const urls = data.urls
    var successUrlsCount = 0
    var times = 0

    urls.forEach(url => {
        makeRecursiveRequest(false, url, successUrlsCount)
    })
    const interval = setInterval(() => {
        if(successUrlsCount >= urls.length) {
            res.send('Todas as reqs foram feitas')
            sendTelegramMensage('Todas as reqs foram feitas')
            clearInterval(interval)
        }
        times++
        if(times > 20) {
            res.send("Erro no req de todos")
            sendTelegramMensage('Erro no req de todos')
            clearInterval(interval)
        }
    }, 1000)
}


export async function setOne(index: number, res: any) {
    console.log('Index: '+ index)
    console.log('Nome: '+ data.getApi(index))

    let url = data.getUrl(index)

    // const resApi = await axios.get(url+'/teste')

    await write('currentMantenedUrl', url)
    await write('currentMantenedName', data.getApi(index))
    await write('off', false)

    sendTelegramMensage('Setado para: '+ (data.getApi(index)).toUpperCase())

    selectTimer()

    res.sendStatus(200)
  
    // if(typeof resApi.data == 'string') res.send('Tudo certo em: ' + data.getApi(index))
    // else res.status(500).send('Erro em ' + data.getApi(index))
}


export async function setAll(res: Response) {
    await write('currentMantenedName', 'all')
    await write('off', false)

    sendTelegramMensage('Setado para TODOS')
    res.send('Setado para todos')
}





export async function turnOff(req:Request, res: Response) {
    await write('off', true)
    await write('currentMantenedUrl', 'https://google.com')
    await write('currentMantenedName', 'Nenhum Selecionado')

    sendTelegramMensage('Tudo OFF')
    res.send("Tudo OFF")
}
