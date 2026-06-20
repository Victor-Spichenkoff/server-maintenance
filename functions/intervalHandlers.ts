import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import axios from "axios";
import {checkIfIsNotReqAndLog} from "../lib/envCheckAndLog";
import {ApiRepository} from "../services/ApiRepository.service";
import {Alert} from "../lib/sendAlerts";
import {thisUrl} from "../global";
import {ServerRepository} from "../services/ServersRepository.service";

// V2


// MAIN APIs

/*
* * Just call and return T/F.
* * Timeout of 8s
* */
export const callCurrentMaintainedApiV2 = async () => {
    let allActiveServers = (await ServerRepository.getAll()).filter(s => s.isActive)
    const allActiveLabels = allActiveServers.map(s => s.label)

    let callingLabel
    let calledSuccessfullyLabels = []
    if (checkIfIsNotReqAndLog("Fake Called " + mapArrayOfLabelsToString(allActiveLabels))) {
        return {isError: false, apiName: mapArrayOfLabelsToString(allActiveLabels)}
    }

    for (const server of allActiveServers) {
        try {
            callingLabel = server.label

            await axios(server.fullUrl, {timeout: 8_000})
            calledSuccessfullyLabels.push(server.label)

        } catch {
            // called 1 or more, but got error in other
            if(calledSuccessfullyLabels.length > 0)
                callingLabel = `CALLED SUCCESSFULLY: ${mapArrayOfLabelsToString(calledSuccessfullyLabels)}\nERROR AT: ${callingLabel}`

            return {isError: true, apiName: callingLabel}
        }
    }

    return {isError: false, apiName: mapArrayOfLabelsToString(calledSuccessfullyLabels)}
}


export const handleCurrentMaintainedCallV2 = async (isSend = false, isHigh = false) => {
    const result = await callCurrentMaintainedApiV2()
    if (result.isError) {
        return await sendTelegramMessageFormatted("Error at: " + result.apiName)
    }

    if (isSend)
        await Alert.sendWorkingAlert(`${isHigh ? "[ HIGH ]" : ""} ${result.apiName}`)
}


// V1


// MAIN APIs

/*
* * Just call and return T/F.
* * Timeout of 8s
* */
export const callCurrentMaintainedApi = async () => {
    const status = await ApiRepository.get()

    try {
        if (checkIfIsNotReqAndLog("Fake Called " + status?.currentMaintainedName)) {
            return {isError: false, apiName: status?.currentMaintainedName}
        }
        await axios(status?.currentMaintainedUrl + "/teste", {timeout: 8_000})
        return {isError: false, apiName: status?.currentMaintainedName}

    } catch {
        return {isError: true, apiName: status?.currentMaintainedName}
    }
}


export const handleCurrentMaintainedCall = async (isSend = false, isHigh = false) => {
    const result = await callCurrentMaintainedApi()
    if (result.isError) {
        return await sendTelegramMessageFormatted("Error at: " + result.apiName)
    }

    if (isSend)
        await Alert.sendWorkingAlert(`${isHigh ? "[ HIGH ]" : ""} ${result.apiName}`)
}

// This
export async function callThis() {
    try {
        await axios(thisUrl)
    } catch {
    }
}


// HELPERS
const mapArrayOfLabelsToString = (list: string[]) => list.join(", ");
