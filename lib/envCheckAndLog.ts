
/*
* * if not_req is true it's going to return true
* */
export const checkIfIsNotReqAndLog = (extraText: string = "") => {
    if (process.env.NOT_REQ != "true")
        return false

    console.log("[ NOT_REQ ] " + extraText)
    return true
}
