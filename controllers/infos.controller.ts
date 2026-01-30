import { RequestHandler } from "express"

import { getApiDataAndValidateIfExists } from "../services/apis.service"
import {apisInfo} from "../data/apisInfo";




export async function sendInfos(req:any, res:any) {
    const data = await getApiDataAndValidateIfExists()

    res.send(data.currentMaintainedName)
}


export const sendInfosById: RequestHandler = async (req, res) => {
    const data = await getApiDataAndValidateIfExists()
    if(data.currentMaintainedName == 'Nothing Selected')
      return res.json(9999)

    if(data.currentMaintainedName == "All")
      return res.json(1717)//id do all. coloquei alto mesmo

    console.log(data.currentMaintainedName)
    const id = apisInfo.filter(x => x.title == data.currentMaintainedName)[0].id
    // const id = urls.getApiIdByName(data.currentMaintainedName as ApiName)//erro aqui
    res.json(id)
  }
