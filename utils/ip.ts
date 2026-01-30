import { Request, Response } from "express";
import { sendTelegramMessage } from "../lib/sendToPhone";

export const informateNewIpAccess = (req: Request, res: Response) => {
    let ip = req.params.ip

    sendTelegramMessage(`O IP de quem acessou foi: ${ip}`)
    res.status(203)
}
