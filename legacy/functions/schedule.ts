import axios from 'axios'

import wrongUrls from '../../functions/verify'
import formatMessageAndSend, {sendTelegramMensage} from '../../lib/sendToPhone'


import {StartKeepApiOnMode} from '../times/operations'
import {getData} from '../../services/apis.service'
import {thisUrl} from '../../global'
import {Cons} from "../../utils/console";



let times = 0


export async function callThis() {
    try {
    await axios(thisUrl)
    } catch{}
}


async function verifyAndSendAll(sendMensage: boolean = false) {
    const objectWithWrong = await wrongUrls()

    times++

    if (sendMensage) formatMessageAndSend(objectWithWrong, times)
    setTimeout(() => {
        axios.get(thisUrl + '/load')
    }, 1000 * 60 * 12)//12 minutos
}


//testar essas duas
export async function makeRecursiveRequest(UseStorage = false, url = '', count: number = 0) {
    const res = await axios.get(url + '/teste')
    if (res) return ++count
    setTimeout(() => {
        makeRecursiveRequest(false, url)
    }, 3000)
}


async function selectTimer(send: boolean = false) {
    const obj = await getData()
    const name = obj.currentMaintainedName.toUpperCase()

    const now = new Date()
    const min = now.getMinutes()
    const hour = now.getHours()


    if (obj.off) {
        await sendTelegramMensage('Sem requisição para APIs (obj.off == true)')
        if (send) await sendTelegramMensage('Desativado')
        return
    }

    // const res = await makeInitialRequests()


    await StartKeepApiOnMode()


    setTimeout(() => {
        if (obj.highMessages)
            selectTimer(true)

        const rightHours = hour == 11 || hour == 15 || hour == 22

        if (rightHours && min > 0 && min < 14) {// 11 = 8 horas no Brasil
            selectTimer(true)
            sendTelegramMensage('Mensagem programada: ' + hour + ' : ' + min)

        } else selectTimer()

    }, 1000 * 60 * 5)


    //para não consumir, desligar em testes
    if (process.env.NOT_REQ == "true")
        return console.log("[ NOT_REQ ] REQUEST to " + obj.currentMaintainedName)

    if (obj.currentMaintainedName == 'All') return verifyAndSendAll(send)

    try {
    const res = await axios.get(obj.currentMaintainedUrl + '/teste')

    Cons.dev(`[ selectTimer ] REQUEST to api -> ${res.data}`)

    if (send && typeof res.data == 'string')
        await sendTelegramMensage('[HIGH] Funcionando ' + name)

    if (send && typeof res.data != 'string')
        await sendTelegramMensage('Erro em: ' + name)

    } catch {
        await sendTelegramMensage('Erro em: ' + name)
    }
}


export {selectTimer}
