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


export const backupUsages = () => {
    // if(process.env.DEV == "true")
    //     return

    const remaingForThisTimeStamp = getRemanigTimeFor('this')
    
    const remaingForThis = timeStampToHourAndMinute(remaingForThisTimeStamp)

    const remaingForMainTimeStamp = getRemanigTimeFor('main')
    
    const remaingForMain = timeStampToHourAndMinute(remaingForMainTimeStamp)

    console.log(`
    Tempo para o THIS: ${remaingForThis.hours}h  ${remaingForThis.minutes}
        
    \n\nTempo para o MAIN: ${remaingForMain.hours}h  ${remaingForMain.minutes}`)
}