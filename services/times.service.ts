import { db } from "../lib/db"
import { ITimeUpdate, timeKeys } from "../types/times"
import {getData} from "./apis.service";
import {onlyAllowedToCallApiUrls} from "../data/apisInfo";
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
    await multipleWriteTimeIfo({
        "lastStart": null,
        "lastDiscount": null,
        "usageMainAccount": 0,
        "usageThisAccount": 0
    })
}


/*
 * Essa que realmente diminui os dados
 */
export const discountFromApis = async () => {
    const timeInfo = await getTimeData()
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

    if (config?.currentMaintainedName == "Nothing Selected")
        return


    let differenceForMain = now - Number(timeInfo.lastDiscount)

    if (config?.currentMaintainedName == "all")
        differenceForMain *= onlyAllowedToCallApiUrls.length

    await writeTimeInfo("usageMainAccount", Number(timeInfo.usageMainAccount) + differenceForMain)
}




export const getMonthAndUpdate = async () => {
    let storageMonth = (await getTimeData()).currentMonth
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

    const timeInfo = await getTimeData()

    await writeTimeInfo("lastDiscount", now)

    if (!timeInfo.lastDiscount)
        return


    const difference = now - Number(timeInfo.lastDiscount)

    await TimeRepository.update({usageThisAccount: Number(timeInfo.usageThisAccount) + difference})
}



/*TODO: REMOVE EVERYTHING BELOW*/


export const getTimeData = async () => {
    const data = await db.time.findFirst({ where: { id: 1 } })

    if(!data) {
        console.log("Sem dados de TIME")
        throw "Sem dados"
    }

    return data
}


export const writeTimeInfo = async (key: timeKeys, value: number | null | boolean) => {
    const data: any = {}
    data[key] = value

    try {
        const res = await db.time.update({
            where: { id: 1 },
            data
        })

        if(!res)
            throw new Error("Erro ao atualizar tempos")

      } catch (err) {
        console.error('Erro ao modificar o Time:', err)
        // await createBaseTimesData()
        // await writeTimeInfo(key, value)
      }
}

export const multipleWriteTimeIfo = async (data: ITimeUpdate) => {
    const res = await db.time.update({
        where: { id: 1 },
        data
    })
}
