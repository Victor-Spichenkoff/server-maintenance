// Time

import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {cycleInADay, intervalInMinute} from "./interval";
import {discountFromApisV2, getMonthAndUpdate} from "../services/times.service";
import {Cons} from "../utils/console";


export const checkTimeAndSendAlert = async (count: number) => {
    if(count % cycleInADay == 0) {
        Cons.Yellow("Enviado alerta - Ciclo zero", true)
        await sendTelegramMessageFormatted("[ Time Alert - CYCLE ] 1 Cycle done. Running: " + count + " times")
        await discountFromApisV2()// 1 vez por dia
    }

    const now = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "America/Sao_Paulo",
        })
    )
    const minute = now.getMinutes()
    const hour = now.getHours()
    const rightHours = hour == 11 || hour == 15 || hour == 22
    if (rightHours && minute > 0 && minute < intervalInMinute + intervalInMinute / 2) {
        Cons.Yellow("Enviado alerta - Hora certa", true)
        await sendTelegramMessageFormatted("[ Time Alert ] Running: " + hour + " : " + minute)
    }
}

/*Once a day it checks*/
export const checkTimeAndUpdateMonth = async (count: number) => {
    if(count % cycleInADay == 0) {
        Cons.Yellow("Momento de validar se mês mudou", true)
        await getMonthAndUpdate()
    }
}
