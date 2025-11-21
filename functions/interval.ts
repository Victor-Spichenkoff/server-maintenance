import {discountFromApis} from "../legacy/times/operations";
import {callThis} from "../legacy/functions/schedule";
import {ApiRepository} from "../services/ApiRepository.service";
import {TimeRepository} from "../services/TimeRepository.service";
import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import axios from "axios";
import {checkIfIsNotReqAndLog} from "../lib/envCheckAndLog";
import {handleCurrentMaintainedCall} from "./intervalHandlers";
import {checkTimeAndSendAlert, checkTimeAndUpdateMonth} from "./intervalTimeHandler";

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
    if(apiCurrentStatus?.currentMantenedUrl == "all") {
        await sendTelegramMessageFormatted("API ALL CALL")//TODO: KEEP ALL
    } else if (!apiCurrentStatus?.off) {
        const isSend = apiCurrentStatus?.hightMenssages || count % cycleInADay == 0
        await handleCurrentMaintainedCall(isSend, apiCurrentStatus?.hightMenssages)
    }

    //  ALERT -> once a day + right hour
    await checkTimeAndSendAlert(count)
    await checkTimeAndUpdateMonth(count)

    count++
    console.log("[ INTERVAL ] ITERATION OF NUMBER " + count)
}


const interval = setInterval(checkStatusAndMakeRequests, 1000 * 60 * intervalInMinute)


export {interval}
