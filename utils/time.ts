import { sendTelegramMensage } from "../functions/sendToPhone"
import { maxTimeAvaliable } from "../global"
import { getTimeData, writeTimeInfo } from "../services/times.service"



/**
 * 
 * @returns ms de quanto ainda sobra
 */
export const getRemanigTimeFor = async (type: "main" | "this") => {
    const timeInfo = await getTimeData()

    var remaing

    if (type == "main") {
        //horas disponiveis (min) - (ms -->min)
        remaing = maxTimeAvaliable * 60 - (Number(timeInfo[`usageMainAccount`]) / 1000 / 60)
    } else {
        remaing = maxTimeAvaliable * 60 - (Number(timeInfo["usageThisAccount"]) / 1000 / 60)
    }

    return remaing * 1000 * 60
}

/**
 * * Deve retornar o tempo de uso em horas em minutos
 */
export const getUSageFor = async (type: "main" | "this") => {
    const timeInfo = await getTimeData()

    let usage

    if (type == "main") {
        usage = timeInfo[`usageMainAccount`]
    } else {
        usage = timeInfo["usageThisAccount"]
    }

    return timeStampToHourAndMinute(Number(usage))
}



export const timeStampToHourAndMinute = (timeStamp: number) => {
    const remanigInMinutes = timeStamp / 1000 / 60
    var hours = remanigInMinutes / 60
    const minutes = Math.floor(hours % 1 * 60)

    hours = Math.floor(hours)

    return { hours, minutes }
}


export const getHoursAndMinutesRemanig = async () => {
    const remaing = await getRemanigTimeFor('main')

    return timeStampToHourAndMinute(remaing)
}



export const getLastStartFormatted = async () => {
    const stoarged = (await getTimeData()).lastStart
    if (!stoarged)
        return null

    const storageLast = new Date(Number(stoarged))
    const brTime = storageLast.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    return brTime
}

export const getlastDiscountFormatted = async () => {
    const stoarged = (await getTimeData()).lastDiscount
    if (!stoarged)
        return null

    const storageLast = new Date(Number(stoarged))
    const brTime = storageLast.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    return brTime
}




export const milisecondsToMinutes = (ms: number) => {
    return ms / 1000 / 60
}


export const setKeepApiOn = () => writeTimeInfo("keepThisApiOn", true)



/**
 * 
 * @param isApiStart Dizer se é inicio geral da api; true só no inicio do app
 */
export const sendUsagesToPhoneOnStart = async (isApiStart?: boolean) => {
    if(process.env.NOT_SEND == "true")
        return

    const usageFotThis = await getUSageFor("this")
    const usageFotMain = await getUSageFor("main")

    sendTelegramMensage(`Uso na inicialização:
        - Main: ${usageFotMain.hours}h ${usageFotMain.minutes}m
        - THIS: ${usageFotThis.hours}h ${usageFotThis.minutes}m

${isApiStart && "THIS ligado agora"}
`)

}