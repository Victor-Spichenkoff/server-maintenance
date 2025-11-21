// Time

import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {cycleInADay, intervalInMinute} from "./interval";
import {getMonthAndUpdate} from "../legacy/times/operations";


export const checkTimeAndSendAlert = async (count: number) => {
    if(count % cycleInADay == 0)
        await sendTelegramMessageFormatted("[ Time Alert ] Running: " + count + " times")

    const now = new Date()
    const min = now.getMinutes()
    const hour = now.getHours()
    const rightHours = hour == 11 || hour == 15 || hour == 22

    if (rightHours && min > 0 && min < intervalInMinute + intervalInMinute / 2) {
        await sendTelegramMessageFormatted("[ Time Alert ] Running: " + hour + " : " + min)
    }
}

/*Once a day it checks*/
export const checkTimeAndUpdateMonth = async (count: number) => {
    if(count % cycleInADay == 0)
        await getMonthAndUpdate()
}
