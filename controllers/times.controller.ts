import { RequestHandler } from "express";
import {
    getLastDiscountFormatted,
    getLastStartFormatted,
    getRemainingTimeFor,
    getUSageFor,
    timeStampToHourAndMinute
} from "../utils/time";
import {
    discountFromApis,
    getMonthAndUpdate,
    getTimeData,
} from "../services/times.service";
import {sendTelegramMensage, sendTelegramMessageFormatted} from "../lib/sendToPhone";
import { maxTimeAvaliableInMiliseconds } from "../global";
import {TimeRepository} from "../services/TimeRepository.service";
import { discountFromThisAccountTime } from "../services/times.service"
import {ApiRepository} from "../services/ApiRepository.service";

export const turnKeepApiOn: RequestHandler = async (req, res) => {
    await TimeRepository.startKeepThisOn()

    res.send("Started")
}


export const turnOffThisApiController: RequestHandler = async (req, res) => {
    await discountFromThisAccountTime()
    await TimeRepository.turnOffThisApi()
    await ApiRepository.turnApiOff()

    await sendTelegramMensage('Tudo OFF')

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

    const remainingForThis = await getRemainingTimeFor('this')

    const { hours, minutes } = timeStampToHourAndMinute(remainingForThis)

    res.send({ hours, minutes })
}


export const getRemainingTimeForMain: RequestHandler = async (req, res) => {
    await discountFromApis()

    const remainingForThis =  await getRemainingTimeFor('main')

    const { hours, minutes } = timeStampToHourAndMinute(remainingForThis)

    res.send({ hours, minutes })
}


export const getBothRemainingTime: RequestHandler = async (req, res) => {
    await getMonthAndUpdate()// First, check whether you need to reset

    const remainingForThisTimeStamp = await getRemainingTimeFor('this')

    const remainingForThis = timeStampToHourAndMinute(remainingForThisTimeStamp)

    const remainingForMainTimeStamp = await getRemainingTimeFor('main')

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
        lastDiscount: await getLastDiscountFormatted()
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
        const remainingForThis =  await getRemainingTimeFor('this')
        const usage = maxTimeAvaliableInMiliseconds - remainingForThis

        oldTimes = timeStampToHourAndMinute(usage)

        await TimeRepository.update({usageThisAccount: timeStamp})

    }

    if(type == "main") {
        const remainingForThis =  await getRemainingTimeFor('main')
        const usage = maxTimeAvaliableInMiliseconds - remainingForThis

        oldTimes = timeStampToHourAndMinute(usage)

        await TimeRepository.update({usageMainAccount: timeStamp})
    }

    if(!oldTimes)
        return res.sendStatus(400)


    const newInfos = timeStampToHourAndMinute(timeStamp)
    await sendTelegramMessageFormatted(`O usage antigo para ${type.toUpperCase()} era: ${oldTimes.hours}h  ${oldTimes.minutes + 1}m
    O usage novo para ${type.toUpperCase()} é: ${newInfos.hours}h  ${newInfos.minutes + 1}m`)

    res.send(`Novo tempo de uso para ${type} - ${hours}h ${minutes}m`)
}
