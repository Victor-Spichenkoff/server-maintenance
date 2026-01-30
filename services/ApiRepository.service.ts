import {db} from "../lib/db";
import {Prisma} from '@prisma/client';
import {ApiDbId} from "../global";
import {write} from "./apis.service";


export const ApiRepository = {
    async get() {
      return db.api.findFirst({ where: { id: ApiDbId } })
    },
    async update(infos: Prisma.ApiUpdateInput) {
        await db.api.update({
            where: {id: ApiDbId},
            data: {...infos}
        })
    },

    async turnApiOff() {
        await write('off', true)
        await write('currentMaintainedUrl', 'https://google.com')
        await write('currentMaintainedName', 'Nothing Selected')
    },
    async setToAll(){
        await write('currentMaintainedName', 'All')
        await write('off', false)
    },
    async setToOne(name: string, url: string){
        await write('currentMaintainedName', name)
        await write('currentMaintainedUrl', url)
        await write('off', false)
    }
}
