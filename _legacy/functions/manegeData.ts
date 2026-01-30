// import fs from 'fs'
// import path from 'path'
// import Urls from '../../functions/urls';
// import { IData } from '../../data/data';
// const path = 'functions/data.json'

// const dataPath = path.join(__dirname, 'data.json');
// // const urls = new Urls()
//
// export type jsonData = {
//   curreMaintainedUrl: string,
//   curreMaintainedName: string,
//   off: boolean,
//   highMessages: boolean
// }
//
// export async function getDataOld(): Promise<IData> {
//     const data = fs.readFileSync(dataPath, 'utf8')
//
//     return JSON.parse(data)
// }
//
//
// export type keysApi = 'currentMaintainedUrl' | 'currentMaintainedName' | 'off' | 'highMessages'
//
// export async function writeOld(key: keysApi, value: string | boolean) {
//
//     try {
//         const dados:any = await getDataOld()
//
//         dados[key] = value
//
//
//         const novoConteudo = JSON.stringify(dados, null, 2)
//         fs.writeFileSync(dataPath, novoConteudo, 'utf8')
//
//         // console.log('Arquivo modificado')
//       } catch (err) {
//         console.error('Erro ao modificar o arquivo:', err)
//       }
// }
//


// base:
// {
//   "currentMaintainedUrl": "https://google.com",
//   "currentMaintainedName": "Nothing Selected",
//   "off": true,
//   "highMessages": false
// }
