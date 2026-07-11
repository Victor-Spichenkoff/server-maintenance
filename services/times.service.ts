import { db } from "../lib/db"
import {getApiDataAndValidateIfExists} from "./apis.service";
import {onlyAllowedToCallApiUrls} from "../data/apisInfo";
import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {TimeRepository} from "./TimeRepository.service";
import {ApiOperationsIds} from "../data/data";
import {ServerRepository} from "./ServersRepository.service";
import {Cons} from "../utils/console";

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
export const discountFromApisV2 = async () => {
    const timeInfo = await getTimeDataAndValidateIfExists()
    const activeCount = await ServerRepository.countActive()

    //nada ocorrendo para ter que descontar
    if (!timeInfo.keepThisApiOn && activeCount == 0) {
        Cons.Log("[DISCOUNTS] Nada para descontar das APIs, nem desconto feito")
        return
    }

    const now = Date.now()

    await TimeRepository.update({lastDiscount: now})

    if (!timeInfo.lastDiscount)
        return

    const differenceForThis = now - Number(timeInfo.lastDiscount)

    await TimeRepository.update({usageThisAccount: Number(timeInfo.usageThisAccount) + differenceForThis})
    Cons.Log("[DISCOUNTS] Consumo desde última iteração para THIS: " + differenceForThis.toLocaleString("pt-BR"))

    // MAIN
    if (activeCount == 0)
        return

    let differenceForMain = now - Number(timeInfo.lastDiscount)

    differenceForMain *= activeCount

    await TimeRepository.update({usageMainAccount: Number(timeInfo.usageMainAccount) + differenceForMain})
    Cons.Log("[DISCOUNTS] Consumo desde última iteração para MAIN: " + differenceForMain.toLocaleString("pt-BR"))
}


/*
 * Essa que realmente diminui os dados
 */
export const discountFromApis = async () => {
    const timeInfo = await getTimeDataAndValidateIfExists()
    const config = await getApiDataAndValidateIfExists()


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

    Cons.Yellow("Mês atualizado: " + newMouth, true)
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
