import {db} from "../lib/db";
import {Prisma} from "@prisma/client";

export const ServerRepository = {
    async getById(id: number) {
        return db.server.findFirst({ where: { id: id } })
    },
    async getAll() {
        return db.server.findMany({orderBy: { id: "asc" }})
    },
    async toggleItem(id: number, newIsActive: boolean) {
        return db.server.update({
            where: {id: id},
            data: {
                isActive: newIsActive,
                LastCalledSuccessfully: null,
                LastCalled: null
            }
        })
    },
    async countActive() {
        return db.server.count({  where: { isActive: true } })
    },
    async updateById(id: number, infos: Prisma.ServerUpdateInput) {
        await db.server.update({
            where: {id: id},
            data: {...infos}
        })
    },
    async setToAll() {
        await db?.server.updateMany({
            where: {
                callOnAll: true
            },
            data: {
                isActive: true
            }
        })
    },
    async setToOff() {
        await db?.server.updateMany({
            where: {
                isActive: true
            },
            data: {
                isActive: false,
                LastCalledSuccessfully: null,
                LastCalled: null
            }
        })
    },
    async setSuccessfullyCalledToNow(id: number) {
        const now = new Date()
        await db?.server.update({
            where: {
                id: Number(id)
            },
            data: {
                LastCalledSuccessfully: now,
                LastCalled: now
            }
        })
    }
}
