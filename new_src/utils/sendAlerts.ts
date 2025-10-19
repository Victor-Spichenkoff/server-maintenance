import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import {getUSageFor} from "../../utils/time";
import {TimeRepository} from "../../services/TimeRepository.service";

export const Alert = {
    async sendUsages(isStart = false) {
        // if(process.env.NOT_SEND == "true")
        //     return

        const usageFotThis = await getUSageFor("this")
        const usageFotMain = await getUSageFor("main")
        const timeCurrentStatus = await TimeRepository.get()

        await sendTelegramMessageFormatted(`Uso atual:
    - Main: ${usageFotMain.hours}h ${usageFotMain.minutes}m
    - THIS: ${usageFotThis.hours}h ${usageFotThis.minutes}m
    - Mês: ${(timeCurrentStatus?.currentMonth ?? 0) + 1}

    ${isStart ? "THIS ligado agora" : ""}
`)
    },

    async sendWorkingAlert(apiName: string) {
        await sendTelegramMessageFormatted("Working: " + apiName)
    }
}
