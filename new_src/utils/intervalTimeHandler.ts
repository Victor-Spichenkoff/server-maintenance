// Time

import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import {cycleInADay, intervalInMinute} from "./interval";


export const checkTimeAndSendAlert = async (count: number) => {
    // TODO: SEND INFOS
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
