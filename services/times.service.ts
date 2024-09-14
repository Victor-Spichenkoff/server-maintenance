import { db } from "../lib/db"
import { ITimeUpdate, timeKeys } from "../types/times"

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
            throw "Erro ao atualizar tempos"

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
