import { RequestHandler } from "express"

import { getData } from "../services/apis.service"
import {apisInfo} from "../data/apisInfo";




export async function sendInfos(req:any, res:any) {
    const data = await getData()

    res.send(data.currentMantenedName)
}


export const sendInfosById: RequestHandler = async (req, res) => {
    const data = await getData()
    if(data.currentMantenedName == 'Nothing Selected')
      return res.json(-1)

    if(data.currentMantenedName == "all")
      return res.json(17)//id do all. coloquei alto mesmo

    console.log(data.currentMantenedName)
    const id = apisInfo.filter(x => x.title == data.currentMantenedName)[0].id
    // const id = urls.getApiIdByName(data.currentMantenedName as ApiName)//erro aqui
    res.json(id)
  }
