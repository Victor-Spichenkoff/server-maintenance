import { db } from "../lib/db"
import { createBaseApisData } from "../services/apis.service"
import { createBaseTimesData } from "../services/times.service"

export const checkAndCreateDataForDb = async () => {
    const time = await db.time.findFirst({ select: { id: true } })
    const data = await db.api.findFirst({ select: { id: true } })

    if(!time) 
        await createBaseTimesData()
 
    if(!data)
        await createBaseApisData()
}