import { Request, Response } from "express"

import formatMensageAndSend, { sendTelegramMensage } from "../lib/sendToPhone"
import wrongUrls from "../functions/verify"
import { getData, write } from "../services/apis.service"


export async function toggleHighMessages(req: Request, res: Response) {
    try {
        const obj = await getData()
        const current = obj?.highMessages
        await write('highMessages', !current)

        res.send(!current)

    } catch {
        res.status(500).send("Erro no servidor")
    }
}


export async function getHighMessagesStatus(req: Request, res: Response) {
    const data = await getData()

    res.send(data?.highMessages)
}



//legado
export const  sendInfosPage = async (req: Request, res: Response) => {
    await sendTelegramMensage('Inciado load Geral')
    const objectWithWrong = await wrongUrls()

    const msg = formatMensageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}
