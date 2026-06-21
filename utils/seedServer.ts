import {serverSeedData} from "../data/data";
import {db} from "../lib/db"

export const SeedServerEntity = async () => {
    for (const server of serverSeedData) {
        await db.server.upsert({
            where: {id: server.id},
            create: server,
            update: {
                shortLabel: server.shortLabel,
                label: server.label,
                fullUrl: server.fullUrl,
                isMain: server.isMain,
                isShowOnQuickActions: server.isShowOnQuickActions,
            },
        })
    }
}

