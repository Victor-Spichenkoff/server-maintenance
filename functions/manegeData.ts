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

export { getData, write }

// base: 
// {
//   "currentMantenedUrl": "https://google.com",
//   "currentMantenedName": "Nenhum Selecionado",
//   "off": true,
//   "hightMenssages": false
// }