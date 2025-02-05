import { Router } from "express"
import { informateNewIpAccess } from "../utils/ip"
import { getHightmenssagesStatus, sendInfosPage, toggleHightMenssages } from "../utils/menssages"
import { sendInfos, sendInfosById } from "../controllers/infos.controller"
import { callAllOnce, callAllOnceSimple, forceLoadAllOnce, setAll, setOne, testOne, turnOff } from "../controllers/actions.controller"
import { getBothRemaningTime, getLastDiscount, getLastStart, getRemanigTimeForMain, getRemanigTimeForThis, getThisStatus, setValueTime, turnKeepApiOn, turnOffThisApiController, updateUsageMiddleware } from "../controllers/times.controller"
import { requestWithLongTimeout, resetTime, testTelegramSendMessage } from "../controllers/tests.controller"

const routes = Router()


export async function initialLoad(req:any, res: any) {
    res.send('Initial load feito')
}


routes.get('/', (req, res) => res.send('Olá'))

routes.get('/teste', (req, res) => res.send('olá'))
//teste geral, não é o modo
routes.get('/isOn', (req, res) => res.send("Está funcionando"))

routes.get('/testar', (req, res) => {
    console.log('testado')
    res.send('Foi')
})
routes.get('/sendMessage', testTelegramSendMessage)

routes.post('/setTime', setValueTime)


//seleção de 1 para manter
routes.get('/portfolio', async (req, res) => setOne(0, res))
routes.get('/vss', async (req, res) => setOne(1, res))
routes.get('/lista', async (req, res) => setOne(2, res))
routes.get('/paginacao', async (req, res) => setOne(3, res))
routes.get('/z', async (req, res) => setOne(4, res))
routes.get('/velha', async (req, res) => setOne(5, res))
// routes.get('/olx', async (req, res) => setOne(4, res))
routes.get('/all', async (req, res) => setAll(res))
routes.get('/turnoff', turnOff)


//mudar prioridades
routes.get('/hightMenssages/toggle', toggleHightMenssages)
routes.get('/hightMenssages/status', getHightmenssagesStatus)


routes.get('/sendIp/:ip',informateNewIpAccess)


//infos
routes.get('/currenton', sendInfos)
routes.get('/currenton/id', sendInfosById)
routes.get('/hightMenssagesStatus', getHightmenssagesStatus)
routes.get('/apiStatus', getThisStatus)



routes.get("/test/one/:id", testOne)




//Ações únicas
routes.get('/initialLoad', initialLoad)
routes.get('/load', sendInfosPage)
//força realmente pelo backend
routes.get('/forceAllOnce', forceLoadAllOnce)
routes.get('/callAllOnce', callAllOnce)
//usar essa para fazer várias, menor
routes.get('/callAllOnce/force', callAllOnceSimple)



//tempo
// routes.use('/usage', updateUsageMiddleware)
routes.use("/usage", updateUsageMiddleware)
routes.get('/usage/both', getBothRemaningTime)
routes.get('/usage/this',getRemanigTimeForThis)
routes.get('/usage/main',getRemanigTimeForMain)

routes.get('/keepApiOn', turnKeepApiOn)
routes.get("/turnOffThis", turnOffThisApiController)

routes.get("/lastStart", getLastStart)
routes.get("/lastDiscount", getLastDiscount)




//para os testes
routes.use((req, res, next) => process.env.DEV ? next() : res.send("Não é dev"))
routes.get('/resetTimes', resetTime)
routes.get('/timeout', requestWithLongTimeout)

export { routes }