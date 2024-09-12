import express, { Request, Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import { routes } from "./config/routes"
import { configDotenv } from 'dotenv'
import { baseConfigForTimeOnStart, keepThisOn } from "./times/operations"

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich

configDotenv()
app.use(cors())

//evitar que ele conte coisas erradas ao iniciar (produção apenas)
baseConfigForTimeOnStart()

keepThisOn()

app.use(routes)


app.listen(process.env.PORT || 2009, () => console.log('Rodando na porta 2009'))