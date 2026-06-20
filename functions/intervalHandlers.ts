import {sendTelegramMessageFormatted} from "../lib/sendToPhone";
import axios from "axios";
import {Alert} from "../lib/sendAlerts";
import {thisUrl} from "../global";
import {ServerRepository} from "../services/ServersRepository.service";
import api from "../lib/axiosApiConfig";

// MAIN APIs
/*
* * Just call and return T/F.
* * Timeout of 8s
* */
export const callCurrentMaintainedApiV2 = async () => {
    let allActiveServers = (await ServerRepository.getAll()).filter(s => s.isActive)

    let callingLabel
    let calledSuccessfullyLabels = []


    for (const server of allActiveServers) {
        try {
            callingLabel = server.label

            await api(server.fullUrl, {timeout: 8_000})

            await ServerRepository.setSuccessfullyCalledToNow(server.id)
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

/*
* Makes the call
* Send to phone, if error
* Send to phone, if time or high messages
* */
export const handleCurrentMaintainedCallV2 = async (isSend = false, isHigh = false) => {
    const result = await callCurrentMaintainedApiV2()
    if (result.isError) {
        return await sendTelegramMessageFormatted(result.apiName??"")
    }

    if (isSend)
        await Alert.sendWorkingAlert(`${isHigh ? "[ HIGH ]" : ""} ${result.apiName}`)
}



// This
export async function callThis() {
    try {
        await api(thisUrl)
    } catch {
    }
}


// HELPERS
const mapArrayOfLabelsToString = (list: string[]) => list.join(", ");
