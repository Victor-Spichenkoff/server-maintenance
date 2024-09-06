import { RequestHandler } from "express";
import { StartKeepApiOnMode, turnThisOff } from "../times/operations";
import { resetAccountsTime } from "../utils/time";

export const turnKeepApiOn: RequestHandler = (req, res) => {
    const mouth = StartKeepApiOnMode()

    res.send("O mes é> " + mouth)
}

export const resetTime:RequestHandler = (req, res) => {
    resetAccountsTime()

    res.send("Tempos zerados")
}


export const turnOffThisApiController: RequestHandler = (req, res) => {
    turnThisOff()

    res.send("API OFF")
}