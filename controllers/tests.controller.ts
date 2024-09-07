import { RequestHandler } from "express"
import { resetAccountsTime } from "../times/operations"

export const resetTime:RequestHandler = (req, res) => {
    resetAccountsTime()

    res.send("Tempos zerados")
}


export const requestWithLongTimeout:RequestHandler = (req, res) => {
    setTimeout(()=> res.send("FOI"), 1_000 * 9)
}