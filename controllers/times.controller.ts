import { RequestHandler } from "express";
import { discountFromApis, getMonthAndUpdate, StartKeepApiOnMode, turnThisOff } from "../times/operations";
import {
    getlastDiscountFormatted,
    getLastStartFormatted,
    getRemanigTimeFor,
    getUSageFor,
    Sleep,
    timeStampToHourAndMinute
} from "../utils/time";
import {getTimeData, multipleWriteTimeIfo, writeTimeInfo} from "../services/times.service";
import { sendTelegramMensage } from "../functions/sendToPhone";
import { maxTimeAvaliableInMiliseconds } from "../global";
import {TimeRepository} from "../services/TimeRepository.service";


export const turnKeepApiOn: RequestHandler = async (req, res) => {
    await multipleWriteTimeIfo({
        "keepThisApiOn": true,
        "lastDiscount": Date.now(),
        "lastStart": Date.now(),
        "alreadyStartedThis": true,
    })

    // StartKeepApiOnMode()//TODO: TEST_V1

    res.send("Iniciado")
}




export const turnOffThisApiController: RequestHandler = async (req, res) => {
    await turnThisOff()

    await TimeRepository.turnOffThisApi()

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
 * Serve para apenas pegar o restante, só não passar os parâmetros
 */
export const getRemainingTimeForThis: RequestHandler = async (req, res) => {
    await getMonthAndUpdate()

    await discountFromApis()

    const remainingForThis = await getRemanigTimeFor('this')

    const { hours, minutes } = timeStampToHourAndMinute(remainingForThis)

    res.send({ hours, minutes })
}


export const getRemainingTimeForMain: RequestHandler = async (req, res) => {
    await discountFromApis()

    const remainingForThis =  await getRemanigTimeFor('main')

    const { hours, minutes } = timeStampToHourAndMinute(remainingForThis)

    res.send({ hours, minutes })
}


export const getBothRemainingTime: RequestHandler = async (req, res) => {
    await getMonthAndUpdate()// First, check whether you need to reset

    const remainingForThisTimeStamp = await getRemanigTimeFor('this')

    const remainingForThis = timeStampToHourAndMinute(remainingForThisTimeStamp)

    const remainingForMainTimeStamp = await getRemanigTimeFor('main')

    const remainingForMain = timeStampToHourAndMinute(remainingForMainTimeStamp)

    res.send({
        main: {
            hours: remainingForMain.hours,
            minutes: remainingForMain.minutes
        },
        this: {
            hours: remainingForThis.hours,
            minutes: remainingForThis.minutes
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
export const setValueTime: RequestHandler = async (req, res) => {
    let { hours, minutes, type } = req.body

    //se ausente, usa o atual
    if(!hours || !minutes) {
        const { hours: storageHours, minutes: storageMinutes } = await getUSageFor(type)

        hours = hours ? hours : storageHours
        minutes = minutes ? minutes : storageMinutes
    }

    if(hours >= 750 && minutes > 0)
        minutes=0


    const timeStamp = Number(hours) * 60 * 60 * 1000 +
        Number(minutes) * 60 * 1000


    let oldTimes: { hours: number, minutes: number } | null = null
    if(type == "this") {
        const remainingForThis =  await getRemanigTimeFor('this')
        const usage = maxTimeAvaliableInMiliseconds - remainingForThis

        oldTimes = timeStampToHourAndMinute(usage)

        await writeTimeInfo("usageThisAccount", timeStamp)
    }

    if(type == "main") {
        const remainingForThis =  await getRemanigTimeFor('main')
        const usage = maxTimeAvaliableInMiliseconds - remainingForThis

        oldTimes = timeStampToHourAndMinute(usage)


        await writeTimeInfo("usageMainAccount", timeStamp)
    }

    if(!oldTimes)
        return res.sendStatus(400)

    await sendTelegramMensage(`O usage antigo para ${type} era: ${oldTimes.hours}h  ${oldTimes.minutes + 1}m`)

    res.send(`Novo tempo de uso para ${type} - ${hours}h ${minutes}m`)
}
