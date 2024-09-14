import { RequestHandler } from "express"

import Urls from "../functions/urls"
import { getData } from "../services/apis.service"
import { ApiName } from "../types/data"

const urls = new Urls()


export async function sendInfos(req:any, res:any) {
    const data = await getData()
    
    res.send(data.currentMantenedName)
}


export const sendInfosById: RequestHandler = async (req, res) => {
    const data = await getData()
    if(data.currentMantenedName == 'Nenhum Selecionado')
      return res.json(-1)
  
    if(data.currentMantenedName == "all")
      return res.json(17)//id do all. coloquei alto mesmo
  
  
    const id = urls.getApiIdByName(data.currentMantenedName as ApiName)//erro aqui
    res.json(id)
  }