import e from "express"
import { getData } from "../functions/manegeData"
import { callThis } from "../functions/schedule"
import { sendTelegramMensage } from "../functions/sendToPhone"
import { maxTimeAvaliable, thirteenMinutes } from "../global"
import { getTimeData, writeTimeInfo } from "./manegeTimeJson"
import { getHoursAndMinutesRemanig, getRemanigTimeFor, resetAccountsTime, timeStampToHourAndMinute } from "../utils/time"
import Urls from "../functions/urls"

/**
 * Já cuida de deixar essa ligada,
 * Só para se acabar o tempo ou setar keepThisOn == false
 */
export const keepThisOn = async () => {
    const timeInfo = getTimeData()

    if(timeInfo.thisAccount < timeInfo.usageThisAccount)
        return sendTelegramMensage("FIM DO TEMPO PARA A API")

    if(!timeInfo.keepThisApiOn)
        return


    const configs = await getData()
    callThis()
    if(configs.hightMenssages)
        sendTelegramMensage("API principal chamada")

    setTimeout(() => keepThisOn(), thirteenMinutes)
}


export const getMonthAndUpdate = () => {
    var storageMonth = getTimeData().currentMonth
    const now = new Date()

    if(now.getMonth() == storageMonth)
        return storageMonth


    resetAccountsTime()

    var newMouth = now.getMonth()
    writeTimeInfo("currentMonth", newMouth)

    return newMouth
}


export const StartKeepApiOnMode = () => {
    const now = Date.now()

    writeTimeInfo("keepThisApiOn", true)
    

    callThis()
}


export const discountFromMainAccountTime = async  () => {
    const now = Date.now()

    const timeInfo = getTimeData()
    const config = await getData()

    writeTimeInfo("lastStart", now)

    if(!timeInfo.lastStart)
       return 


    var difference = now - Number(timeInfo.lastStart)


    if(config.currentMantenedName == 'all')
        difference *= new Urls().urls.length

    console.log("Diferença: " + difference)

    writeTimeInfo("usageMainAccount", timeInfo.usageMainAccount + difference)

}

export const discountFromThisAccountTime = () => {
    const now = Date.now()

    const timeInfo = getTimeData()

    writeTimeInfo("lastStart", now)

    if(!timeInfo.lastStart)
       return 


    const difference = now - Number(timeInfo.lastStart)

    console.log("Diferença: " + difference)

    writeTimeInfo("usageMainAccount", timeInfo.usageMainAccount + difference)
}






/**
 * Essa que realmente diminui os dados
 */
export const discountFromApis = () => {
    discountFromMainAccountTime()
    discountFromThisAccountTime

    const infoData = getTimeData()
    
    const { hours, minutes } = getHoursAndMinutesRemanig()

    return `${hours}:${minutes}`
    // return ""
}





/**
 * Chamar para desligar e parar de contar
 */
export const turnThisOff = () => {
    discountFromThisAccountTime()

    writeTimeInfo("keepThisApiOn", false)
    writeTimeInfo("lastStart", null)    

}
