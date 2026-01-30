import { RequestHandler } from "express"
import { sendTelegramMensage } from "../lib/sendToPhone"
import {resetAccountsTime} from "../services/times.service";


export const resetTime:RequestHandler = async (req, res) => {
    await resetAccountsTime()

    res.send("Tempos zerados")
}


export const requestWithLongTimeout:RequestHandler = (req, res) => {
    setTimeout(()=> res.send("FOI"), 1_000 * 9)
}


export const testTelegramSendMessage:RequestHandler = async (req, res) => {
    await sendTelegramMensage("Testando envio de mensagem")

    res.sendStatus(202)
}
