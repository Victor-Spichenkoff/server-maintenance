import fs from 'fs'
const path = 'functions/data.json'

type jsonData = {
  currentMantenedUrl: string,
  currentMantenedName: string,
  off: boolean,
  hightMenssages: boolean
}

async function getData() {
    const data = await fs.readFileSync(path, 'utf8')

    return JSON.parse(data)

}

type keys = 'currentMantenedUrl' | 'currentMantenedName' | 'off' | 'hightMenssages'

async function write(key: keys, value: string | boolean) {
    
    try {
        const dados = await getData()

        dados[key] = value
        
      
        const novoConteudo = JSON.stringify(dados, null, 2)
        fs.writeFileSync(path, novoConteudo, 'utf8')
      
        // console.log('Arquivo modificado')
      } catch (err) {
        console.error('Erro ao modificar o arquivo:', err)
      }
}


async function sendInfos(req:any, res:any) {
    const data = await getData()
    
    res.send(data.currentMantenedName)
}

export { sendInfos, getData, write }

// base: 
// {
//   "currentMantenedUrl": "https://google.com",
//   "currentMantenedName": "Nenhum Selecionado",
//   "off": true,
//   "hightMenssages": false
// }