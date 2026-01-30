// Time

import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {cycleInADay, intervalInMinute} from "./interval";
import {getMonthAndUpdate} from "../services/times.service";


export const checkTimeAndSendAlert = async (count: number) => {
    if(count % cycleInADay == 0)
        await sendTelegramMessageFormatted("[ Time Alert ] Running: " + count + " times")

    const now = new Date()
    const minute = now.getMinutes()
    const hour = now.getHours()
    const rightHours = hour == 11 || hour == 15 || hour == 22
    if (rightHours && minute > 0 && minute < intervalInMinute + intervalInMinute / 2) {
        await sendTelegramMessageFormatted("[ Time Alert ] Running: " + hour + " : " + minute)
    }
}

/*Once a day it checks*/
export const checkTimeAndUpdateMonth = async (count: number) => {
    if(count % cycleInADay == 0)
        await getMonthAndUpdate()
}
