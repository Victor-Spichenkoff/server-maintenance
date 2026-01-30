import { Request, Response } from "express"

import formatMessageAndSend, { sendTelegramMessage } from "../lib/sendToPhone"
import wrongUrls from "../functions/verify"
import { getApiDataAndValidateIfExists } from "../services/apis.service"
import {ApiRepository} from "../services/ApiRepository.service";


export async function toggleHighMessages(req: Request, res: Response) {
    try {
        const obj = await getApiDataAndValidateIfExists()
        const current = obj?.highMessages
        await ApiRepository.update({highMessages: !current })

        res.send(!current)

    } catch {
        res.status(500).send("Erro no servidor")
    }
}


export async function getHighMessagesStatus(req: Request, res: Response) {
    const data = await getApiDataAndValidateIfExists()

    res.send(data?.highMessages)
}



//legado
export const  sendInfosPage = async (req: Request, res: Response) => {
    await sendTelegramMessage('Inciado load Geral')
    const objectWithWrong = await wrongUrls()

    const msg = formatMessageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}
