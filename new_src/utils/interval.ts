import {discountFromApis} from "../../times/operations";
import {callThis} from "../../functions/schedule";
import {ApiRepository} from "../../services/ApiRepository.service";
import {TimeRepository} from "../../services/TimeRepository.service";
import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import axios from "axios";
import {checkIfIsNotReqAndLog} from "./envCheckAndLog";

let count = 1
let intervalInMinute = 6
let cycleInADay = 24*60 / intervalInMinute // now -> 240 cycles


const checkStatusAndMakeRequests = async (notRequestThis = false) => {
//  DISCOUNT
    await discountFromApis()
    const apiCurrentStatus = await ApiRepository.get()
    const timeCurrentStatus = await TimeRepository.get()

//  THIS
    if (!(await ApiRepository.get())?.off && !notRequestThis)
        await callThis()

//  MAIN
    if(apiCurrentStatus?.currentMantenedUrl == "all") {
        await sendTelegramMessageFormatted("API ALL CALL")
    } else if (!apiCurrentStatus?.off) {
        const isSend = apiCurrentStatus?.hightMenssages || count % cycleInADay == 0
        await handleCurrentMaintainedCall(isSend)
    }//  ALERT -> once a day + right hour
    await checkTimeAndSendAlert(count)

    count++
    console.log("[ INTERVAL ] ITERATION OF NUMBER " + count)
}


const interval = setInterval(checkStatusAndMakeRequests, 1000 * 60 * intervalInMinute)

// SUPPORT functions


// MAIN APIs

/*
* * Just call and return T/F.
* * Timeout of 8s
* */
export const callCurrentMaintainedApi = async () => {
    const status = await ApiRepository.get()

    try {
        if(checkIfIsNotReqAndLog("Fake Called " + status?.currentMantenedName)) {
            return { isError: false, apiName: status?.currentMantenedName }
        }
        await axios(status?.currentMantenedUrl + "/teste", { timeout: 8_000 })
        return { isError: false, apiName: status?.currentMantenedName }

    } catch {
        return { isError: true, apiName: status?.currentMantenedName }
    }
}


export const handleCurrentMaintainedCall = async (isSend = false) => {
    const result = await callCurrentMaintainedApi()
    if(result.isError) {
        return await sendTelegramMessageFormatted("Error at: " + result.apiName)
    }

    if(isSend)
        await sendTelegramMessageFormatted("Working " + result.apiName)
}


// Time
const checkTimeAndSendAlert = async (count: number) => {
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


export {interval}
