import {RequestHandler} from "express"

import {getApiDataAndValidateIfExists} from "../services/apis.service"
import {apisInfo} from "../data/apisInfo";
import {ApiOperationsIds} from "../data/data";


export async function sendInfos(req: any, res: any) {
    const data = await getApiDataAndValidateIfExists()

    res.send(data.currentMaintainedName)
}


export const sendInfosById: RequestHandler = async (req, res) => {
    const data = await getApiDataAndValidateIfExists()
    if (data.currentMaintainedId == ApiOperationsIds.nothing)
        return res.json(ApiOperationsIds.nothing)

    if (data.currentMaintainedId == ApiOperationsIds.all)
        return res.json(ApiOperationsIds.all)//id do all. coloquei alto mesmo

    const id = apisInfo.filter(x => x.title == data.currentMaintainedName)[0].id

    res.json(id)
}
