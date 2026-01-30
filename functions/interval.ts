
import {ApiRepository} from "../services/ApiRepository.service";
import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import {callThis, handleCurrentMaintainedCall} from "./intervalHandlers";
import {checkTimeAndSendAlert, checkTimeAndUpdateMonth} from "./intervalTimeHandler";
import {discountFromApis} from "../services/times.service";

export let intervalInMinute = 6
export let cycleInADay = 24*60 / intervalInMinute // now -> 240 cycles/day
let count = 1


const checkStatusAndMakeRequests = async (notRequestThis = false) => {
//  DISCOUNT
    await discountFromApis()
    const apiCurrentStatus = await ApiRepository.get()


//  THIS
    if (!(await ApiRepository.get())?.off && !notRequestThis)
        await callThis()

//  MAIN
    if(apiCurrentStatus?.currentMaintainedUrl == "all") {
        await sendTelegramMessageFormatted("API ALL CALL")//TODO: KEEP ALL
    } else if (!apiCurrentStatus?.off) {
        const isSend = apiCurrentStatus?.highMessages || count % cycleInADay == 0
        await handleCurrentMaintainedCall(isSend, apiCurrentStatus?.highMessages)
    }

    //  ALERT -> once a day + right hour
    await checkTimeAndSendAlert(count)
    await checkTimeAndUpdateMonth(count)

    console.log("[ INTERVAL ] ITERATION OF NUMBER " + count)
    count++
}


const interval = setInterval(checkStatusAndMakeRequests, 1000 * 60 * intervalInMinute)


export {interval}
