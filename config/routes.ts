import { Router } from "express"
import { informateNewIpAccess } from "../utils/ip"
import { getHighMessagesStatus, sendInfosPage, toggleHighMessages } from "../utils/menssages"
import { sendInfos, sendInfosById } from "../controllers/infos.controller"
import { callAllOnce, callAllOnceSimpleAndIgnore, forceLoadAllOnce, setAll, setOne, testOne, turnOff } from "../controllers/actions.controller"
import { getBothRemainingTime, getLastDiscount, getLastStart, getRemainingTimeForMain, getRemainingTimeForThis, getThisStatus, setValueTime, turnKeepApiOn, turnOffThisApiController, updateUsageMiddleware } from "../controllers/times.controller"
import { requestWithLongTimeout, resetTime, testTelegramSendMessage } from "../controllers/tests.controller"

const routes = Router()


export async function initialLoad(req:any, res: any) {
    res.send('Initial load feito')
}


routes.get('/', (req, res) => res.send('Olá'))

routes.get('/teste', (req, res) => res.send('olá'))
//teste geral, não é o modo
routes.get('/isOn', (req, res) => res.send("It's working"))

routes.get('/testar', (req, res) => {
    console.log('testado')
    res.send('Foi')
})
routes.get('/sendMessage', testTelegramSendMessage)

routes.post('/setTime', setValueTime)


//seleção de 1 para manter/status da api
routes.get('/set/1717', async (req, res) => setAll(res))
routes.get('/set/9999', turnOff)
routes.get('/set/:id', async (req, res) => setOne(req, res))


//mudar prioridades
routes.get('/highMessages/toggle', toggleHighMessages)
routes.get('/highMessages/status', getHighMessagesStatus)


routes.get('/sendIp/:ip',informateNewIpAccess)


//infos
routes.get('/currenton', sendInfos)
routes.get('/currenton/id', sendInfosById)
routes.get('/highMessagesStatus', getHighMessagesStatus)
routes.get('/apiStatus', getThisStatus)



routes.get("/test/one/:id", testOne)




//Ações únicas
routes.get('/initialLoad', initialLoad)
routes.get('/load', sendInfosPage)
//força realmente pelo backend
routes.get('/forceAllOnce', forceLoadAllOnce)
routes.get('/callAllOnce', callAllOnce)
//usar essa para fazer várias, menor
routes.get('/callAllOnce/force', callAllOnceSimpleAndIgnore)



//tempo
// routes.use('/usage', updateUsageMiddleware)
routes.use("/usage", updateUsageMiddleware)
routes.get('/usage/both', getBothRemainingTime)
routes.get('/usage/this',getRemainingTimeForThis)
routes.get('/usage/main',getRemainingTimeForMain)

routes.get('/keepApiOn', turnKeepApiOn)
routes.get("/turnOffThis", turnOffThisApiController)

routes.get("/lastStart", getLastStart)
routes.get("/lastDiscount", getLastDiscount)




//para os testes
routes.use((req, res, next) => process.env.DEV ? next() : res.send("Não é dev"))
routes.get('/resetTimes', resetTime)
routes.get('/timeout', requestWithLongTimeout)

export { routes }
