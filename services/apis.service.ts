import { Prisma } from "@prisma/client"
import { db } from "../lib/db"
import { IData } from "../types/data"

export const createBaseApisData = async () => {
    const data = {
        id: 1,
        currentMantenedUrl: "https://google.com",
        currentMantenedName: "Nenhum Selecionado",
        off: true,
        hightMenssages: false
    }

    await db.api.create({ data })
    console.log("Criado com id 1")
}


export const getData = async () => {
    const data = await db.api.findFirst({ where: { id: 1 } })
    if (!data)
        throw "Sem dados no \"data\""
    
    return data
}


export type keysApi = 'currentMantenedUrl' | 'currentMantenedName' | 'off' | 'hightMenssages' | "id"


export async function write(key: keysApi, value: string | boolean) {
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