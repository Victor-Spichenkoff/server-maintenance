import { callThis } from "../functions/schedule"
import {sendTelegramMensage, sendTelegramMessageFormatted} from "../../lib/sendToPhone"
import { maxTimeAvaliable, thirteenMinutes } from "../../global"

import { sendUsagesToPhone } from "../../utils/time"
import Urls from "../../functions/urls"
import { turnOff } from "../../controllers/actions.controller"
import { getData } from "../../services/apis.service"
import { getTimeData, multipleWriteTimeIfo, writeTimeInfo } from "../../services/times.service"



export const resetAccountsTime = async () => {
    await multipleWriteTimeIfo({
        "lastStart": null,
        "lastDiscount": null,
        "usageMainAccount": 0,
        "usageThisAccount": 0
    })
}


let times = 0
/**
 * * Já cuida de deixar essa ligada,
 * * Só para se acabar o tempo ou setar keepThisOn == false
 * * Se tiver ligado outro, ele desativa as chamadas desse, não precisa se já é chamdo no schedule
 */
export const keepThisOn = async () => {
    const timeInfo = await getTimeData()

    if (maxTimeAvaliable < timeInfo.usageThisAccount / BigInt(1000 * 60 * 60))
        return sendTelegramMensage("FIM DO TEMPO PARA A API")

    if (!timeInfo.keepThisApiOn)
        return


    const now = Date.now()

    //debug
    times++
    const formated = (new Date(now)).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    console.log("Execução " + times + " - " + formated)

    if (!timeInfo.lastStart) {
        await writeTimeInfo("lastStart", now)
    }

    const configs = await getData()

    await callThis()

    // discountFromApis()

    if (configs?.hightMenssages)
        await sendTelegramMensage("[HIGH] API principal chamada")

    setTimeout(() => keepThisOn(), thirteenMinutes / 3)
}


export const getMonthAndUpdate = async () => {
    let storageMonth = (await getTimeData()).currentMonth
    const now = new Date()

    if (now.getMonth() == storageMonth)
        return storageMonth


    await resetAccountsTime()

    let newMouth = now.getMonth()
        await writeTimeInfo("currentMonth", newMouth)

    await sendTelegramMessageFormatted("Novo mês, novo tempo!")

    return newMouth
}


export const StartKeepApiOnMode = async () => {
    const isAlreadyStarted = (await getTimeData()).alreadyStartedThis

    //não precisa ficar iniciando
    if (isAlreadyStarted)
        return

    times = 0

    await sendUsagesToPhone()

    await getMonthAndUpdate()
    keepThisOn()
}

/**
 * ele não mexe no start, apenas o this pode mudar ele
 */
export const discountFromMainAccountTime = async () => {
    const config = await getData()
    if (config?.currentMantenedName == "Nenhum Selecionado")
        return


    const now = Date.now()

    const timeInfo = await getTimeData()

    if (!timeInfo.lastDiscount)
        return

    await writeTimeInfo("lastDiscount", now)

    let difference = now - Number(timeInfo.lastDiscount)

    if (config?.currentMantenedName == 'all')
        difference *= (new Urls()).urls.length

    await writeTimeInfo("usageMainAccount", Number(timeInfo.usageMainAccount) + difference)
}


export const discountFromThisAccountTime = async () => {
    const now = Date.now()

    const timeInfo = await getTimeData()

    await writeTimeInfo("lastDiscount", now)

    if (!timeInfo.lastDiscount)
        return


    const difference = now - Number(timeInfo.lastDiscount)


    await  writeTimeInfo("usageThisAccount", Number(timeInfo.usageThisAccount) + difference)
}




/**
 * Essa que realmente diminui os dados
 */
export const discountFromApis = async () => {
    const timeInfo = await getTimeData()
    const config = await getData()


    //nada ocorrendo para ter que descontar
    if (!timeInfo.keepThisApiOn && config?.off)
        return

    const now = Date.now()

    await writeTimeInfo("lastDiscount", now)

    if (!timeInfo.lastDiscount)
        return


    const differenceForThis = now - Number(timeInfo.lastDiscount)

    await writeTimeInfo("usageThisAccount", Number(timeInfo.usageThisAccount) + differenceForThis)

    if (config?.currentMantenedName == "Nenhum Selecionado")
        return


    let differenceForMain = now - Number(timeInfo.lastDiscount)

    if (config?.currentMantenedName == "all")
        differenceForMain *= (new Urls()).urls.length

    await writeTimeInfo("usageMainAccount", Number(timeInfo.usageMainAccount) + differenceForMain)
}
// export const discountFromApis = () => {
//     discountFromMainAccountTime()
//     discountFromThisAccountTime()
// }

/**
 * Chamar para desligar e parar de contar
 */
export const turnThisOff = async () => {
    await discountFromThisAccountTime()

    //se é para desligar essa, desligar as outras também (não vai chamar)
    await turnOff()

    await sendTelegramMensage("Desativando API")
}


export const baseConfigForTimeOnStart = () => {
    if (process.env.DEV == "true") return

    // writeTimeInfo("lastDiscount", null)
    writeTimeInfo("lastStart", null)
}
