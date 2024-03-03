import express, { Request, Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import wrongUrls from "./functions/verify"
import formatMensageAndSend, { sendTelegramMensage } from "./functions/sendToPhone"
import { getData, sendInfos, write } from "./functions/manegeData"
import { forceLoadAllOnce, setAll, setOne, turnOf } from "./functions/schedule"

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich

app.use(cors())


app.get('/', (req, res) => res.send('Olá'))
app.get('/teste', (req, res) => res.send('olá'))

async function sendInfosPage(req: any, res: any) {
    sendTelegramMensage('inciado load Geral')
    const objectWithWrong = await wrongUrls()

    const msg = formatMensageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}

function teste(req:any, res:any) {
    console.log('testado')
    res.send('Foi')
}


//implementar enviar mensgagem a cada rodada de reqs
// a pagina deve mostrar se está ou não ativo
async function toggleHightMenssages(req: Request, res: Response) {
    const obj = await getData()
    const current = obj.hightMenssages
    await write('hightMenssages', !current)
    const data = await getData()
    console.log(data.hightMenssages)

    getHightmenssagesStatus(req, res)
}


async function getHightmenssagesStatus(req: Request, res: Response) {

    //só pede
    const data = await getData();
    res.send(data.hightMenssages ? 'Ativado' : 'Desativado')
}

async function initialLoad(req: Request, res: Response) {
    res.send('Initial load feito')
}



app.get('/testar', teste)

app.get('/load', sendInfosPage)

app.get('/forceAllOnce', forceLoadAllOnce)

app.get('/portfolio', async (req, res) => setOne(0, res))
app.get('/vss', async (req, res) => setOne(1, res))
app.get('/lista', async (req, res) => setOne(2, res))
app.get('/paginacao', async (req, res) => setOne(3, res))
app.get('/all', async (req, res) => setAll(res))
app.get('/turnoff', turnOf)

app.get('/initialLoad', initialLoad)
app.get('/currenton', sendInfos)


app.get('/toggleHightMenssages', toggleHightMenssages)
app.get('/hightMenssagesStatus', getHightmenssagesStatus)

app.listen(process.env.PORT || 2009, () => console.log('Rodando na porta 2009'))