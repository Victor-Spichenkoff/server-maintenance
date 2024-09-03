import { Request, Response } from "express"
import { getData, write } from "../functions/manegeData"
import formatMensageAndSend, { sendTelegramMensage } from "../functions/sendToPhone"
import wrongUrls from "../functions/verify"


//implementar enviar mensgagem a cada rodada de reqs
// a pagina deve mostrar se está ou não ativo
export async function toggleHightMenssages(req: Request, res: Response) {
    const obj = await getData()
    const current = obj.hightMenssages
    await write('hightMenssages', !current)
    const data = await getData()
    console.log(data.hightMenssages)

    getHightmenssagesStatus(req, res)
}


export const  sendInfosPage = async (req: Request, res: Response) => {
    sendTelegramMensage('inciado load Geral')
    const objectWithWrong = await wrongUrls()

    const msg = formatMensageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}


export async function getHightmenssagesStatus(req: Request, res: Response) {
    //só pede
    const data = await getData();
    res.send(data.hightMenssages ? 'Ativado' : 'Desativado')
}