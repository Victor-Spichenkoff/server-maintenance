// Time

import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {cycleInADay, intervalInMinute} from "./interval";
import {discountFromApisV2, getMonthAndUpdate} from "../services/times.service";
import {Cons} from "../utils/console";

/*
* Enviar mensagem:
* * Completou 1 ciclo inteiro
* Altera a contagem:
* *
* */
export const checkTimeAndSendAlert = async (count: number) => {
    if(count % cycleInADay == 0) {
        Cons.Yellow("Atingido um ciclo completo", true)
        await discountFromApisV2()// 1 vez por dia no momento ciclo zero
        await sendTelegramMessageFormatted(`[ Time Alert - Cycle ] rodando há: ${count / cycleInADay}`)
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
        await discountFromApisV2()// 3 vezes por dia no momento do alerta real enviado
        Cons.Yellow("Enviado alerta - Hora certa", true)
        // await sendTelegramMessageFormatted(`[ Time Alert ] Running:  ${hour}:${minute}`)
    }
}

/*Once a day it checks*/
export const checkTimeAndUpdateMonth = async (count: number) => {
    if(count % cycleInADay == 0) {
        Cons.Yellow("Momento de validar se mês mudou", true)
        await getMonthAndUpdate()
    }
}
