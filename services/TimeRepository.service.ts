import {multipleWriteTimeIfo} from "./times.service";

export const TimeRepository = {
    async turnOffThisApi() {
        await multipleWriteTimeIfo({
            "keepThisApiOn": false,
            "lastStart": null,
            "alreadyStartedThis": false,
            "lastDiscount": null,
        })
    }
}
