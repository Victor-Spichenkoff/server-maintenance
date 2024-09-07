import e from "express"
import { getData, write } from "../functions/manegeData"
import { callThis } from "../functions/schedule"
import { sendTelegramMensage } from "../functions/sendToPhone"
import { maxTimeAvaliable, thirteenMinutes } from "../global"
import { getTimeData, writeTimeInfo } from "./manegeTimeJson"
import { getHoursAndMinutesRemanig, getRemanigTimeFor, timeStampToHourAndMinute } from "../utils/time"
import Urls from "../functions/urls"
import { turnOff } from "../controllers/actions.controller"



export const resetAccountsTime = () => {
    writeTimeInfo("lastStart", null)
    writeTimeInfo("lastDiscount", null)
    writeTimeInfo("usageMainAccount", 0)
    writeTimeInfo("usageThisAccount", 0)
}



/**
 * * Já cuida de deixar essa ligada,     
 * * Só para se acabar o tempo ou setar keepThisOn == false     
 * * Se tiver ligado outro, ele desativa as chamadas desse, não precisa se já é chamdo no schedule
 */
export const keepThisOn = async () => {
    const timeInfo = getTimeData()

    if (maxTimeAvaliable < timeInfo.usageThisAccount / 1000 / 60 / 60)
        return sendTelegramMensage("FIM DO TEMPO PARA A API")

    if (!timeInfo.keepThisApiOn)
        return


    const now = Date.now()

    if (!timeInfo.lastStart) {
        writeTimeInfo("lastStart", now)
    }

    if (timeInfo.lastDiscount) {
        discountFromThisAccountTime()
    }

    writeTimeInfo("lastDiscount", now)


    const configs = await getData()

    if (configs.currentMantenedName == "Nenhum Selecionado")
        callThis()

    discountFromApis()

    if (configs.hightMenssages)
        sendTelegramMensage("API principal chamada")

    setTimeout(() => keepThisOn(), thirteenMinutes)
}


export const getMonthAndUpdate = () => {
    var storageMonth = getTimeData().currentMonth
    const now = new Date()

    if (now.getMonth() == storageMonth)
        return storageMonth


    resetAccountsTime()

    var newMouth = now.getMonth()
    writeTimeInfo("currentMonth", newMouth)

    return newMouth
}


export const StartKeepApiOnMode = () => {
    const now = Date.now()

    writeTimeInfo("keepThisApiOn", true)
    writeTimeInfo("lastDiscount", Date.now())


    keepThisOn()
}

/**
 * ele não mexe no start, apenas o this pode mudar ele
 */
export const discountFromMainAccountTime = async () => {
    const config = await getData()
    if (config.currentMantenedName == "Nenhum Selecionado")
        return


    const now = Date.now()

    const timeInfo = getTimeData()

    if (!timeInfo.lastDiscount)
        return


    var difference = now - Number(timeInfo.lastDiscount)

    if (config.currentMantenedName == 'all')
        difference *= (new Urls()).urls.length

    console.log("Diferença: " + difference)

    writeTimeInfo("usageMainAccount", timeInfo.usageMainAccount + difference)
}


export const discountFromThisAccountTime = () => {
    const now = Date.now()

    const timeInfo = getTimeData()

    writeTimeInfo("lastDiscount", now)

    if (!timeInfo.lastDiscount)
        return


    const difference = now - Number(timeInfo.lastDiscount)

    console.log("Diferença no THIS: " + difference)

    writeTimeInfo("usageThisAccount", timeInfo.usageThisAccount + difference)
}






/**
 * Essa que realmente diminui os dados
 */
export const discountFromApis = async () => {
    const timeInfo = getTimeData()
    const config = await getData()


    const now = Date.now()

    writeTimeInfo("lastDiscount", now)

    if (!timeInfo.lastDiscount)
        return


    const differenceForThis = now - Number(timeInfo.lastDiscount)

    console.log("Diferença no THIS: " + differenceForThis)

    writeTimeInfo("usageThisAccount", timeInfo.usageThisAccount + differenceForThis)

    if(config.currentMantenedName == "Nenhum Selecionado")
        return


    let differenceForMain = now - Number(timeInfo.lastDiscount)
    
    if(config.currentMantenedName == "all")
        differenceForMain *= (new Urls()).urls.length
    
    
    console.log("Diferença no MAIN: " + differenceForMain)
    writeTimeInfo("usageMainAccount", timeInfo.usageMainAccount + differenceForMain)
}
// export const discountFromApis = () => {
//     discountFromMainAccountTime()
//     discountFromThisAccountTime()
// }





/**
 * Chamar para desligar e parar de contar
 */
export const turnThisOff = () => {
    discountFromThisAccountTime()

    writeTimeInfo("keepThisApiOn", false)
    writeTimeInfo("lastStart", null)
    writeTimeInfo("lastDiscount", null)

    //se é para desligar essa, desligar as outras também (não vai chamar)
    turnOff()

    sendTelegramMensage("Desativando API")
}


export const baseConfigForTimeOnStart = () => {
    if (process.env.DEV) return

    writeTimeInfo("lastDiscount", null)
    writeTimeInfo("lastStart", null)
}