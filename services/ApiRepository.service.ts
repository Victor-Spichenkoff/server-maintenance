import {db} from "../lib/db";
import {Prisma} from '@prisma/client';
import {ApiDbId} from "../global";
import {write} from "./apis.service";


export const ApiRepository = {
    async update(infos: Prisma.ApiUpdateInput) {
        await db.api.update({
            where: {id: ApiDbId},
            data: {...infos}
        })
    },

    async turnApiOff() {
        await write('off', true)
        await write('currentMantenedUrl', 'https://google.com')
        await write('currentMantenedName', 'Nenhum Selecionado')
    },
    async setToAll(){
        await write('currentMantenedName', 'all')
        await write('off', false)
    },
    async setToOne(name: string, url: string){
        await write('currentMantenedName', name)
        await write('currentMantenedUrl', url)
        await write('off', false)
    }
}
