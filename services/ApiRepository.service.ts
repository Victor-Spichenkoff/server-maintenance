import {db} from "../lib/db";
import {Prisma} from '@prisma/client';
import {ApiDbId} from "../global";
import {ApiNames, ApiOperationsIds, ApiUrls} from "../data/data";


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
        await this.update({
            currentMaintainedId: ApiOperationsIds.nothing,
            currentMaintainedName: ApiNames.nothing,
            currentMaintainedUrl: ApiUrls.nothing,
            off: true,

        })
    },
    async setToAll(){
        await this.update({
            currentMaintainedId: ApiOperationsIds.all,
            currentMaintainedName: ApiNames.all,
            currentMaintainedUrl: ApiUrls.all,
            off: false,
        })
    },
    async setToOne(apiId: number, name: string, url: string){
        await this.update({
            currentMaintainedId: apiId,
            currentMaintainedName: name,
            currentMaintainedUrl: url,
            off: false,
        })
    },
}
