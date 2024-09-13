import express, { Request, Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import { routes } from "./config/routes"
import { configDotenv } from 'dotenv'
import { baseConfigForTimeOnStart, keepThisOn } from "./times/operations"
import { sendBackupUsages } from "./utils/time"

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich

configDotenv()
app.use(cors())
app.use(express.json())


//evitar que ele conte coisas erradas ao iniciar (produção apenas)
baseConfigForTimeOnStart()
sendBackupUsages()
keepThisOn()

app.use(routes)


app.listen(process.env.PORT || 2009, () => console.log('Rodando na porta 2009'))