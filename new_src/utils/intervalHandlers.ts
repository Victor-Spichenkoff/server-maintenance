import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import axios from "axios";
import {checkIfIsNotReqAndLog} from "./envCheckAndLog";
import {ApiRepository} from "../../services/ApiRepository.service";
import {Alert} from "./sendAlerts";
import {thisUrl} from "../../global";



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


export const handleCurrentMaintainedCall = async (isSend = false, isHigh = false) => {
    const result = await callCurrentMaintainedApi()
    if(result.isError) {
        return await sendTelegramMessageFormatted("Error at: " + result.apiName)
    }

    if(isSend)
        await Alert.sendWorkingAlert(`${isHigh ? "[ HIGH ]" : ""} ${result.apiName}` ?? "")
}

// This
export async function callThis() {
    try {
        await axios(thisUrl)
    } catch{}
}
