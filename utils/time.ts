import {sendTelegramMensage} from "../lib/sendToPhone"
import {maxTimeAvaliable} from "../global"
import {getTimeData} from "../services/times.service"


/**
 *
 * @returns ms de quanto ainda sobra
 */
export const getRemainingTimeFor = async (type: "main" | "this") => {
    const timeInfo = await getTimeData()

    let remaining

    if (type == "main") {
        //horas disponíveis (min) - (ms -->min)
        remaining = maxTimeAvaliable * 60 - (Number(timeInfo[`usageMainAccount`]) / 1000 / 60)
    } else {
        remaining = maxTimeAvaliable * 60 - (Number(timeInfo["usageThisAccount"]) / 1000 / 60)
    }

    return remaining * 1000 * 60
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
    const remainingInMinutes = timeStamp / 1000 / 60
    let hours = remainingInMinutes / 60
    const minutes = Math.floor(hours % 1 * 60)

    hours = Math.floor(hours)

    return { hours, minutes }
}


export const getHoursAndMinutesRemaining = async () => {
    const remaining = await getRemainingTimeFor('main')

    return timeStampToHourAndMinute(remaining)
}



export const getLastStartFormatted = async () => {
    const stoarge = (await getTimeData()).lastStart
    if (!stoarge)
        return null

    const storageLast = new Date(Number(stoarge))
    return storageLast.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
}

export const getLastDiscountFormatted = async () => {
    const storage = (await getTimeData()).lastDiscount
    if (!storage)
        return null

    const storageLast = new Date(Number(storage))
    return storageLast.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
}




export const milisecondsToMinutes = (ms: number) => {
    return ms / 1000 / 60
}


/**
 *
 * @param isApiStart Dizer se é inicio geral da api; true só no inicio do app
 */
export const sendUsagesToPhone = async (isApiStart?: boolean) => {
    if(process.env.NOT_SEND == "true")
        return

    const usageFotThis = await getUSageFor("this")
    const usageFotMain = await getUSageFor("main")

    await sendTelegramMensage(`Uso na inicialização:
        - Main: ${usageFotMain.hours}h ${usageFotMain.minutes}m
        - THIS: ${usageFotThis.hours}h ${usageFotThis.minutes}m

${isApiStart && "THIS ligado agora"}
`)

}


export const Sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))
