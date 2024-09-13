import { RequestHandler } from "express"
import { sendTelegramMensage } from "../functions/sendToPhone"
import { resetAccountsTime } from "../times/operations"


export const resetTime:RequestHandler = (req, res) => {
    resetAccountsTime()

    res.send("Tempos zerados")
}


export const requestWithLongTimeout:RequestHandler = (req, res) => {
    setTimeout(()=> res.send("FOI"), 1_000 * 9)
}


export const testTelegramSendMessage:RequestHandler = (req, res) => {
    sendTelegramMensage("Testando envio de mensagem")
    
    res.sendStatus(202)
}