import express, { Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import wrongUrls from "./functions/verify"
import formatMensageAndSend from "./functions/sendToPhone"

// verifyAndSend(true)

app.use(cors())


app.get('/', (req, res) => res.send('Olá'))
app.get('/teste', (req, res) => res.send('olá'))

async function sendInfosPage(req: any, res: any) {
    console.log('requisição')
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

app.listen(process.env.PORT || 2006, () => console.log('Rodando na porta 2006'))