import { Request, Response } from "express"

import formatMensageAndSend, { sendTelegramMensage } from "../functions/sendToPhone"
import wrongUrls from "../functions/verify"
import { getData, write } from "../services/apis.service"


export async function toggleHightMenssages(req: Request, res: Response) {
    try {
        const obj = await getData()
        const current = obj?.hightMenssages
        await write('hightMenssages', !current)

        res.send(!current)

    } catch {
        res.status(500).send("Erro no servidor")
    }
}


export async function getHightmenssagesStatus(req: Request, res: Response) {
    const data = await getData()

    res.send(data?.hightMenssages)
}



//legado
export const  sendInfosPage = async (req: Request, res: Response) => {
    sendTelegramMensage('inciado load Geral')
    const objectWithWrong = await wrongUrls()

    const msg = formatMensageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}
