import path from 'path'
import { ITime, timeKeys } from '../types/times'
import fs from 'fs'

const timeDataPath = path.join(__dirname, 'time.json');


export function getTimeDataOld(): ITime {
    const data = fs.readFileSync(timeDataPath, 'utf8')

    return JSON.parse(data)
}


export function writeTimeInfoOld(key: timeKeys, value: number | null | boolean) {
    try {
        const dados:any = getTimeDataOld()

        dados[key] = value
      
        const novoConteudo = JSON.stringify(dados, null, 2)
        fs.writeFileSync(timeDataPath, novoConteudo, 'utf8')
      } catch (err) {
        console.error('Erro ao modificar o arquivo:', err)
      }
}

