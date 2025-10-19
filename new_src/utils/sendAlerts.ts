import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import {getUSageFor} from "../../utils/time";

export const Alert = {
    async sendUsages(isStart = false) {
        if(process.env.NOT_SEND == "true")
            return

        const usageFotThis = await getUSageFor("this")
        const usageFotMain = await getUSageFor("main")

        await sendTelegramMessageFormatted(`Uso atual:
        - Main: ${usageFotMain.hours}h ${usageFotMain.minutes}m
        - THIS: ${usageFotThis.hours}h ${usageFotThis.minutes}m

        ${isStart && "THIS ligado agora"}
`)
    },

    async sendWorkingAlert(apiName: string) {
        await sendTelegramMessageFormatted("Working: " + apiName)
    }
}
