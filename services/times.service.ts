import { db } from "../lib/db"
import {getData} from "./apis.service";
import {ApiOperationsIds, onlyAllowedToCallApiUrls} from "../data/apisInfo";
import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {TimeRepository} from "./TimeRepository.service";

export const createBaseTimesData = async () => {
    const data = {
        id: 1,
        currentMonth: 8,
        keepThisApiOn: false,
        usageMainAccount: 0,
        usageThisAccount: 0,
        lastStart: null,
        lastDiscount: null,
        alreadyStartedThis: false
    }

    await db.time.create({ data })

    console.log("Criado Times com id 1")
}


export const resetAccountsTime = async () => {
    await TimeRepository.update({
        lastStart: null,
        lastDiscount: null,
        usageMainAccount: 0,
        usageThisAccount: 0,
    })
}


/*
 * Essa que realmente diminui os dados
 */
export const discountFromApis = async () => {
    const timeInfo = await getTimeDataAndValidateIfExists()
    const config = await getData()


    //nada ocorrendo para ter que descontar
    if (!timeInfo.keepThisApiOn && config?.off)
        return

    const now = Date.now()

    await TimeRepository.update({lastDiscount: now})

    if (!timeInfo.lastDiscount)
        return


    const differenceForThis = now - Number(timeInfo.lastDiscount)

    await TimeRepository.update({usageThisAccount: Number(timeInfo.usageThisAccount) + differenceForThis})

    if (config?.currentMaintainedId == ApiOperationsIds.nothing)
        return


    let differenceForMain = now - Number(timeInfo.lastDiscount)

    if (config?.currentMaintainedId ==  ApiOperationsIds.all)
        differenceForMain *= onlyAllowedToCallApiUrls.length

    await TimeRepository.update({usageMainAccount: Number(timeInfo.usageMainAccount) + differenceForMain})
}




export const getMonthAndUpdate = async () => {
    let storageMonth = (await getTimeDataAndValidateIfExists()).currentMonth
    const now = new Date()

    if (now.getMonth() == storageMonth)
        return storageMonth


    await resetAccountsTime()

    let newMouth = now.getMonth()
    await TimeRepository.update({currentMonth: newMouth})


    await sendTelegramMessageFormatted("Novo mês, novo tempo!")

    return newMouth
}




export const discountFromThisAccountTime = async () => {
    const now = Date.now()

    const timeInfo = await getTimeDataAndValidateIfExists()

    await TimeRepository.update({lastDiscount: now})

    if (!timeInfo.lastDiscount)
        return


    const difference = now - Number(timeInfo.lastDiscount)

    await TimeRepository.update({usageThisAccount: Number(timeInfo.usageThisAccount) + difference})
}




export const getTimeDataAndValidateIfExists = async () => {
    const data = await db.time.findFirst({ where: { id: 1 } })

    if(!data) {
        console.log("Sem dados de TIME")
        throw "Sem dados"
    }

    return data
}
