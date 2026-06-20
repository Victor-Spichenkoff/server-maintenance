
import {ApiRepository} from "../services/ApiRepository.service";
import {callThis, handleCurrentMaintainedCallV2} from "./intervalHandlers";
import {checkTimeAndSendAlert, checkTimeAndUpdateMonth} from "./intervalTimeHandler";
import {discountFromApisV2} from "../services/times.service";

export let intervalInMinute = 6
export let cycleInADay = 24*60 / intervalInMinute // now -> 240 cycles/day
let count = 1


const checkStatusAndMakeRequests = async (notRequestThis = false) => {
//  DISCOUNT
    await discountFromApisV2()
    const apiCurrentStatus = await ApiRepository.get()

//  THIS
    if (!(await ApiRepository.get())?.off && !notRequestThis)
        await callThis()

//  MAIN
    // TODO: PRECISO ARRUMAR COMO VOU ENVIAR O ALL
    // if(apiCurrentStatus?.currentMaintainedUrl == "all") {
    //     await sendTelegramMessageFormatted("API ALL CALL")//TODO: KEEP ALL
    // } else if (!apiCurrentStatus?.off) {
        const isSend = apiCurrentStatus?.highMessages || count % cycleInADay == 0
    //     await handleCurrentMaintainedCall(isSend, apiCurrentStatus?.highMessages)
    // }
    await handleCurrentMaintainedCallV2(isSend, apiCurrentStatus?.highMessages)

    //  ALERT -> once a day + right hour
    await checkTimeAndSendAlert(count)
    await checkTimeAndUpdateMonth(count)

    console.log("[ INTERVAL ] ITERATION OF NUMBER " + count)
    count++
}


const interval = setInterval(checkStatusAndMakeRequests, 1000 * 60 * intervalInMinute)


export {interval}
