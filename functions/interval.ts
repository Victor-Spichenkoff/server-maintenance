import {ApiRepository} from "../services/ApiRepository.service";
import {callThis, handleCurrentMaintainedCallV2} from "./intervalHandlers";
import {checkTimeAndSendAlert, checkTimeAndUpdateMonth} from "./intervalTimeHandler";
import {discountFromApisV2} from "../services/times.service";
import {Cons} from "../utils/console";
import {TimeRepository} from "../services/TimeRepository.service";

export let intervalInMinute = 6
export let cycleInADay = 24 * 60 / intervalInMinute // now -> 240 cycles/day
let count = 1


const checkStatusAndMakeRequests = async (notRequestThis = false) => {
//  DISCOUNT
    try {

        await discountFromApisV2()
        const apiCurrentStatus = await ApiRepository.get()

        //  THIS
        if ((await TimeRepository.get())?.keepThisApiOn && !notRequestThis)
        // if (!(await ApiRepository.get())?.off && !notRequestThis)
            await callThis()

        //  MAIN
        const isSend = apiCurrentStatus?.highMessages || count % cycleInADay == 0

        await handleCurrentMaintainedCallV2(isSend, apiCurrentStatus?.highMessages)

        //  ALERT -> once a day + right hour
        await checkTimeAndSendAlert(count)
        await checkTimeAndUpdateMonth(count)

        Cons.Blue("[ INTERVAL ] ITERATION OF NUMBER " + count, true)
        count++
    } catch (error: any) {
        Cons.Error("Erro no interval:", error)
    }
}


const interval = setInterval(checkStatusAndMakeRequests, 1000 * 60 * intervalInMinute)


export {interval}
