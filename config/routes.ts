import { Router } from "express"
import { informateNewIpAccess } from "../utils/ip"
import { getHightmenssagesStatus, sendInfosPage, toggleHightMenssages } from "../utils/menssages"
import { sendInfos, sendInfosById } from "../controllers/infos.controller"
import { forceLoadAllOnce, setAll, setOne, turnOff } from "../controllers/actions.controller"
import { resetTime, turnKeepApiOn, turnOffThisApiController } from "../controllers/times.controller"
import { discountFromApis } from "../times/operations"

const routes = Router()


export async function initialLoad(req:any, res: any) {
    res.send('Initial load feito')
}


routes.get('/', (req, res) => res.send('Olá'))
routes.get('/teste', (req, res) => res.send('olá'))


routes.get('/testar', (req, res) => {
    console.log('testado')
    res.send('Foi')
})



//seleção de 1 para manter
routes.get('/portfolio', async (req, res) => setOne(0, res))
routes.get('/vss', async (req, res) => setOne(1, res))
routes.get('/lista', async (req, res) => setOne(2, res))
routes.get('/paginacao', async (req, res) => setOne(3, res))
routes.get('/all', async (req, res) => setAll(res))
routes.get('/turnoff', turnOff)


//Ações únicas
routes.get('/initialLoad', initialLoad)
routes.get('/load', sendInfosPage)
routes.get('/forceAllOnce', forceLoadAllOnce)


//infos
routes.get('/currenton', sendInfos)
routes.get('/currenton/id', sendInfosById)
routes.get('/hightMenssagesStatus', getHightmenssagesStatus)


//tempo
routes.get('/resetTimes', resetTime)
routes.get('/keepApiOn', turnKeepApiOn)
routes.get('/updateUsages', (req, res) => {
    const hoursMinutes = discountFromApis()
    res.send("restante no main: " +  hoursMinutes)
})

routes.get("/turnOffThis", turnOffThisApiController)


//mudar prioridades
routes.get('/toggleHightMenssages', toggleHightMenssages)


routes.get('/sendIp/:ip',informateNewIpAccess)





export { routes }