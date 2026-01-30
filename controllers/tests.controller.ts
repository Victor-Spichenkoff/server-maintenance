import { RequestHandler } from "express"
import { sendTelegramMessage } from "../lib/sendToPhone"
import {resetAccountsTime} from "../services/times.service";


export const resetTime:RequestHandler = async (req, res) => {
    await resetAccountsTime()

    res.send("Tempos zerados")
}


export const requestWithLongTimeout:RequestHandler = (req, res) => {
    setTimeout(()=> res.send("FOI"), 1_000 * 9)
}


export const testTelegramSendMessage:RequestHandler = async (req, res) => {
    await sendTelegramMessage("Testando envio de mensagem")

    res.sendStatus(202)
}
