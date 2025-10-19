// MAIN APIs

/*
* * Just call and return T/F.
* * Timeout of 8s
* */
import {sendTelegramMessageFormatted} from "../../functions/sendToPhone";
import axios from "axios";
import {checkIfIsNotReqAndLog} from "./envCheckAndLog";
import {ApiRepository} from "../../services/ApiRepository.service";
import {Alert} from "./sendAlerts";

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
        await Alert.sendWorkingAlert(result.apiName ?? "")
}



// This
