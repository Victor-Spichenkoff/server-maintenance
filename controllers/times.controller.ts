import { RequestHandler } from "express";
import { discountFromApis, StartKeepApiOnMode, turnThisOff } from "../times/operations";
import { getlastDiscountFormatted, getLastStartFormatted, getRemanigTimeFor, timeStampToHourAndMinute } from "../utils/time";
import { getTimeData, writeTimeInfo } from "../services/times.service";


export const turnKeepApiOn: RequestHandler = (req, res) => {
    StartKeepApiOnMode()

    res.send("Iniciado")
}




export const turnOffThisApiController: RequestHandler = (req, res) => {
    turnThisOff()

    res.send("API OFF")
}

export const getLastStart: RequestHandler = async (req, res) => {
    const brTime = await getLastStartFormatted()

    res.send(brTime)
}


export const getLastDiscount: RequestHandler = async (req, res) => {
    const storageLast = new Date(Number(
        (await getTimeData()).lastDiscount
    ))
    const brTime = storageLast.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    res.send(brTime)
}


/**
 * Serve para apenas pegar o restante, só não pasasr os parametros
 */
export const getRemanigTimeForThis: RequestHandler = async (req, res) => {
    discountFromApis()

    const remaingForThis = await getRemanigTimeFor('this')
    
    const { hours, minutes } = timeStampToHourAndMinute(remaingForThis)

    res.send({ hours, minutes })
}


export const getRemanigTimeForMain: RequestHandler = async (req, res) => {
    discountFromApis()

    const remaingForThis =  await getRemanigTimeFor('main')
    
    const { hours, minutes } = timeStampToHourAndMinute(remaingForThis)

    res.send({ hours, minutes })
}


export const getBothRemaningTime: RequestHandler = async (req, res) => {
    const remaingForThisTimeStamp = await getRemanigTimeFor('this')
    
    const remaingForThis = timeStampToHourAndMinute(remaingForThisTimeStamp)

    const remaingForMainTimeStamp = await getRemanigTimeFor('main')
    
    const remaingForMain = timeStampToHourAndMinute(remaingForMainTimeStamp)

    res.send({ 
        main: {
            hours: remaingForMain.hours,
            minutes: remaingForMain.minutes
        },
        this: {
            hours: remaingForThis.hours,
            minutes: remaingForThis.minutes
        },
        lastStart: await getLastStartFormatted(),
        lastDiscount: await getlastDiscountFormatted()
     })
}


export const updateUsageMiddleware: RequestHandler = async (req, res, next) => {
    await discountFromApis()
    
    next()
}


export const getThisStatus:RequestHandler = async (req, res) => {
    const response = await getTimeData()
    const status = response.keepThisApiOn

    res.send(status)
}


//para arrumar os tempos, caso erre no deploy
export const setValueTime: RequestHandler = (req, res) => {
    const { hours, minutes, type } = req.body

    const timeStamp = Number(hours) * 60 * 60 * 1000 + 
        Number(minutes) * 60 * 1000


    if(type == "this")
        writeTimeInfo("usageThisAccount", timeStamp)
    if(type == "main")
        writeTimeInfo("usageMainAccount", timeStamp)

    res.send(`Novo tempo de uso para ${type} - ${hours}h ${minutes}m `)
}