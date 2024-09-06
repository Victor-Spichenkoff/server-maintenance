import express, { Request, Response } from "express"
import cors from 'cors'
const app = express()
import './functions/sendToPhone'
import './functions/schedule'
import { routes } from "./config/routes"
import { configDotenv } from 'dotenv'

//Minha conta para  esse: edge(conta secundária)(spichekoffvictor)
//nome: VictorSpich

configDotenv()
app.use(cors())




app.use(routes)


app.listen(process.env.PORT || 2009, () => console.log('Rodando na porta 2009'))