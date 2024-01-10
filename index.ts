import express, { Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import wrongUrls from "./functions/verify"
import formatMensageAndSend from "./functions/sendToPhone"
import { sendInfos } from "./functions/manegeData"
import { setAll, setOne, turnOf } from "./functions/schedule"

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich

app.use(cors())


app.get('/', (req, res) => res.send('Olá'))
app.get('/teste', (req, res) => res.send('olá'))

async function sendInfosPage(req: any, res: any) {
    const objectWithWrong = await wrongUrls()

    const msg = formatMensageAndSend(objectWithWrong, 1, true)

    res.send(msg)
}

function teste(req:any, res:any) {
    console.log('testado')
    res.send('Foi')
}

app.get('/testar', teste)

app.get('/load', sendInfosPage)

app.get('/portfolio', async (req, res) => setOne(0, res))
app.get('/vss', async (req, res) => setOne(1, res))
app.get('/lista', async (req, res) => setOne(2, res))
app.get('/paginacao', async (req, res) => setOne(3, res))
app.get('/all', async (req, res) => setAll(res))
app.get('/turnoff', turnOf)


app.get('/currenton', sendInfos)

app.listen(process.env.PORT || 2006, () => console.log('Rodando na porta 2006'))