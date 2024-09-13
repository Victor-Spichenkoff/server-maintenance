import { sendTelegramMensage } from "../functions/sendToPhone"
import { maxTimeAvaliable } from "../global"
import { getTimeData, writeTimeInfo } from "../times/manegeTimeJson"


/**
 * 
 * @returns ms de quanto ainda sobra
 */
export const getRemanigTimeFor = (type: "main" | "this") => {
    const timeInfo = getTimeData()

    var remaing

    if(type == "main") {
        //horas disponiveis (min) - (ms -->min)
        remaing = maxTimeAvaliable * 60 - (timeInfo[`usageMainAccount`]/1000/60)
    } else {
        remaing = maxTimeAvaliable * 60 - (timeInfo["usageThisAccount"]/1000/60)
    }

    return remaing * 1000 * 60
}

/**
 * * Deve retornar o tempo de uso em horas em minutos
 */
export const getUSageFor = (type: "main" | "this") => {
    const timeInfo = getTimeData()

    let usage

    if(type == "main") {
        usage = timeInfo[`usageMainAccount`]
    } else {
        usage = timeInfo["usageThisAccount"]
    }

    return timeStampToHourAndMinute(usage)
}



export const timeStampToHourAndMinute = (timeStamp: number) => {
    const remanigInMinutes = timeStamp / 1000 / 60
    var hours = remanigInMinutes / 60
    const minutes = Math.floor(hours % 1 * 60)

    hours = Math.floor(hours)

    return { hours, minutes }
}


export const getHoursAndMinutesRemanig = () => {
    const remaing = getRemanigTimeFor('main')

    return timeStampToHourAndMinute(remaing)
}



export const getLastStartFormatted = () => {
    const stoarged = getTimeData().lastStart
    if(!stoarged) 
        return null

    const storageLast = new Date(Number(stoarged))
    const brTime = storageLast.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    
    return brTime
}

export const getlastDiscountFormatted = () => {
    const stoarged = getTimeData().lastDiscount
    if(!stoarged) 
        return null

    const storageLast = new Date(Number(stoarged))
    const brTime = storageLast.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    
    return brTime
}




export const milisecondsToMinutes = (ms: number) => {
    return ms / 1000 / 60
}


export const setKeepApiOn = () => writeTimeInfo("keepThisApiOn", true)




export const sendBackupUsages = () => {
    if(process.env.DEV == "true")
        return

    
    const usageForThis = getUSageFor("this")

    
    const usageForMain = getUSageFor("main")

    console.log(`Backup:
Tempo para o THIS: ${usageForThis.hours}h  ${usageForThis.minutes}m
Tempo para o MAIN: ${usageForMain.hours}h  ${usageForMain.minutes}m`)
}   