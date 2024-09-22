import { Request, Response } from "express";
import { sendTelegramMensage } from "../functions/sendToPhone";

export const informateNewIpAccess = (req: Request, res: Response) => {
    let ip = req.params.ip

    sendTelegramMensage(`O IP de quem acessou foi: ${ip}`)
    res.status(203)
}