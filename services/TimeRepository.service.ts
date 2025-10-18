import {multipleWriteTimeIfo} from "./times.service";
import {db} from "../lib/db";
import {TimeDbId} from "../global";

export const TimeRepository = {
    async turnOffThisApi() {
        await multipleWriteTimeIfo({
            "keepThisApiOn": false,
            "lastStart": null,
            "alreadyStartedThis": false,
            "lastDiscount": null,
        })
    },
    async get() {
        return db.time.findUnique({ where: { id:TimeDbId} })
    },
    async setKeepThisOn() {
        await db.time.update({
            where: { id: TimeDbId },
            data: { keepThisApiOn: true, lastStart: Date.now() },
        })
    }
}
