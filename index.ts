import express, { Request, Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import { routes } from "./config/routes"
import { configDotenv } from 'dotenv'
import { baseConfigForTimeOnStart, keepThisOn } from "./times/operations"
import { sendBackupUsages, sendUsagesToPhoneOnStart } from "./utils/time"
import { checkAndCreateDataForDb } from "./utils/db"

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich


// checkAndCreateDataForDb()

configDotenv()
app.use(cors())
app.use(express.json())


//evitar que ele conte coisas erradas ao iniciar (produção apenas)
baseConfigForTimeOnStart()
sendBackupUsages()
keepThisOn()


sendUsagesToPhoneOnStart(true)

app.use(routes)


app.listen(process.env.PORT || 2009, () => console.log('Rodando na porta 2009'))