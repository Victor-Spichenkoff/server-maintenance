import {db} from "../lib/db";
import {ApiDbId} from "../global";
import {Prisma} from "@prisma/client";

export const ServerRepository = {
    async getById(id: number) {
        return db.server.findFirst({ where: { id: ApiDbId } })
    },
    async getAll() {
        return db.server.findMany()
    },
    async countActive() {
        return db.server.count({  where: { isActive: true } })
    },
    async updateById(id: number, infos: Prisma.ServerUpdateInput) {
        await db.server.update({
            where: {id: ApiDbId},
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
        await db?.server.update({
            where: {
                id: Number(id)
            },
            data: {
                LastCalledSuccessfully: Date.now(),
                LastCalled: Date.now()
            }
        })
    }
}
