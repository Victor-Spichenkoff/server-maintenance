import express from "express"
import cors from 'cors'

const app = express()
import './lib/sendToPhone'
import './legacy/functions/schedule'
import {routes} from "./config/routes"
import {configDotenv} from 'dotenv'
import {baseConfigForTimeOnStart} from "./legacy/times/operations"
import {sendUsagesToPhone} from "./utils/time"
import {selectTimer} from "./legacy/functions/schedule";
import "./functions/interval"
import {Alert} from "./lib/sendAlerts";

//Minha conta para esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich


// checkAndCreateDataForDb()

configDotenv()
app.use(cors({
    //deixar tudo, incluindo eu mesmo
    origin: true
}))
app.use(express.json())

//evitar que ele conte coisas erradas ao iniciar (produção apenas)
baseConfigForTimeOnStart()


// selectTimer(true).then(r => {})//TODO: TEST_V1

app.use(routes)


app.listen(process.env.PORT ?? 2009, () => {
    Alert.sendUsages(true).then()
    console.log('Rodando na porta 2009')
})
