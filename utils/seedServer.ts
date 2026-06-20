import {serverSeedData} from "../data/data";
import {db} from "../lib/db"

export const SeedServerEntity = async () => {
    for (const server of serverSeedData) {
        await db.server.upsert({
            where: {fullUrl: server.fullUrl},
            create: server,
            update: {
                shortLabel: server.shortLabel,
                label: server.label,
                fullUrl: server.fullUrl,
                callOnAll: server.callOnAll,
            },
        })
    }
}

