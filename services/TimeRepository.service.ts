import {multipleWriteTimeIfo} from "./times.service";
import {db} from "../lib/db";
import {TimeDbId} from "../global";
import {Prisma} from "@prisma/client";

export const TimeRepository = {
    async get() {
        return db.time.findUnique({ where: { id:TimeDbId} })
    },
    async update(data: Prisma.TimeUpdateInput) {
        await db.time.update({
            where: { id: TimeDbId },
            data: { ...data }
        })
    },
    async turnOffThisApi() {
        await this.update({
            keepThisApiOn: false,
            lastStart: null,
            alreadyStartedThis: false,
            lastDiscount: null
        })
    },

    async setKeepThisOn() {
        await this.update({
            keepThisApiOn: true,
            lastStart: Date.now()
        })
    },
    /*
    * Includes set alreadyStartedThis and lastDiscount
    * */
    async startKeepThisOn() {
        await this.update({
            keepThisApiOn: true,
            lastDiscount: Date.now(),
            lastStart: Date.now(),
            alreadyStartedThis: true
        })

            await multipleWriteTimeIfo({
                "keepThisApiOn": true,
                "lastDiscount": Date.now(),
                "lastStart": Date.now(),
                "alreadyStartedThis": true,
            })
    }
}
