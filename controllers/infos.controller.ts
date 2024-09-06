import { RequestHandler } from "express"
import { getData } from "../functions/manegeData"
import Urls from "../functions/urls"

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
  
  
    const id = urls.getApiIdByName(data.currentMantenedName)
    res.json(id)
  }