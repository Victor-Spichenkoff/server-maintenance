import { db } from "../lib/db"

export const createBaseApisData = async () => {
    const data = {
        id: 1,
        currentMaintainedUrl: "https://google.com",
        currentMaintainedName: "Nothing Selected",
        off: true,
        highMessages: false
    }

    await db.api.create({ data })
    console.log("Criado com id 1")
}


export const getApiDataAndValidateIfExists = async () => {
    const data = await db.api.findFirst({ where: { id: 1 } })
    if (!data)
        throw "Sem dados no \"data\""

    return data
}


export type keysApi = 'currentMaintainedUrl' | 'currentMaintainedName' | 'off' | 'highMessages' | "id" | "currentMaintainedId"


export async function write(key: keysApi, value: string | boolean | number) {
    const data:any = {}
    data[key] = value

    try {
        const res = await db.api.update({
            where: { id: 1 },
            data
        })
    } catch (err) {
        console.error('Erro ao modificar o arquivo:', err)
    }
}

