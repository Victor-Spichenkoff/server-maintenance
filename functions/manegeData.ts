import { RequestHandler } from 'express';
import fs from 'fs'
import path from 'path'
import Urls from './urls';
import { IData } from '../types/data';
// const path = 'functions/data.json'

const dataPath = path.join(__dirname, 'data.json');
const urls = new Urls()

type jsonData = {
  currentMantenedUrl: string,
  currentMantenedName: string,
  off: boolean,
  hightMenssages: boolean
}

async function getData(): Promise<IData> {
    const data = await fs.readFileSync(dataPath, 'utf8')

    return JSON.parse(data)

}

type keys = 'currentMantenedUrl' | 'currentMantenedName' | 'off' | 'hightMenssages'

async function write(key: keys, value: string | boolean) {
    
    try {
        const dados:any = await getData()

        dados[key] = value
        
      
        const novoConteudo = JSON.stringify(dados, null, 2)
        fs.writeFileSync(dataPath, novoConteudo, 'utf8')
      
        // console.log('Arquivo modificado')
      } catch (err) {
        console.error('Erro ao modificar o arquivo:', err)
      }
}


async function sendInfos(req:any, res:any) {
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


export { sendInfos, getData, write }

// base: 
// {
//   "currentMantenedUrl": "https://google.com",
//   "currentMantenedName": "Nenhum Selecionado",
//   "off": true,
//   "hightMenssages": false
// }