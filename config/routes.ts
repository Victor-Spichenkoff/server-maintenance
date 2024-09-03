import { Router } from "express"
import { forceLoadAllOnce, setAll, setOne, turnOf } from "../functions/schedule"
import { sendInfos } from "../functions/manegeData"
import { informateNewIpAccess } from "../utils/ip"
import { getHightmenssagesStatus, sendInfosPage, toggleHightMenssages } from "../utils/menssages"

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

routes.get('/load', sendInfosPage)

routes.get('/forceAllOnce', forceLoadAllOnce)

routes.get('/portfolio', async (req, res) => setOne(0, res))
routes.get('/vss', async (req, res) => setOne(1, res))
routes.get('/lista', async (req, res) => setOne(2, res))
routes.get('/paginacao', async (req, res) => setOne(3, res))
routes.get('/all', async (req, res) => setAll(res))
routes.get('/turnoff', turnOf)

routes.get('/initialLoad', initialLoad)
routes.get('/currenton', sendInfos)


routes.get('/toggleHightMenssages', toggleHightMenssages)
routes.get('/hightMenssagesStatus', getHightmenssagesStatus)


routes.get('/sendIp/:ip',informateNewIpAccess)





export { routes }