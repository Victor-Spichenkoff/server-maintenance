import axios, {AxiosError} from 'axios'

const schedule = require('node-schedule')
import wrongUrls from './verify'
import formatMensageAndSend, {sendTelegramMensage} from './sendToPhone'
import Urls from "./urls"

import {StartKeepApiOnMode} from '../times/operations'
import {getData} from '../services/apis.service'
import {thisUrl} from '../global'
import {Cons} from "../utils/console";

const data = new Urls()


// const thisUrl = 'https://server-maintenance.onrender.com'//old

let times = 0
let first = true


export function callThis() {
    axios.get(thisUrl)
}


async function verifyAndSendAll(sendMensage: boolean = false) {
    const objectWithWrong = await wrongUrls()

    times++

    if (sendMensage) formatMensageAndSend(objectWithWrong, times)
    setTimeout(() => {
        axios.get(thisUrl + '/load')
    }, 1000 * 60 * 12)//12 minutos
}


//testar essas duas
export async function makeRecursiveRequest(UseStoraged = false, url = '', count: number = 0) {
    const res = await axios.get(url + '/teste')
    if (res) return ++count
    const timeOut = setTimeout(() => {
        makeRecursiveRequest(false, url)
    }, 3000)
}


async function selectTimer(send: boolean = false) {
    const obj = await getData()
    const name = obj.currentMantenedName.toUpperCase()

    const now = new Date()
    const min = now.getMinutes()
    const hour = now.getHours()


    if (obj.off) {
        sendTelegramMensage('Sem requisição para APIs (obj.off == true)')
        if (send) sendTelegramMensage('Desativado')
        return
    }

    // const res = await makeInitialRequests()


    StartKeepApiOnMode()


    setTimeout(() => {
        if (obj.hightMenssages)
            selectTimer(true)

        const rightHours = hour == 11 || hour == 15 || hour == 22

        if (rightHours && min > 0 && min < 14) {// 11 = 8 horas no Brasil
            selectTimer(true)
            sendTelegramMensage('Mensagem programada: ' + hour + ' : ' + min)

        } else selectTimer()

    }, 1000 * 60 * 5)


    //para não consumir, desligar em testes
    if (process.env.NOT_REQ == "true")
        return console.log("[ NOT_REQ ] REQUEST to " + obj.currentMantenedName)

    if (obj.currentMantenedName == 'all') return verifyAndSendAll(send)

    try {
    const res = await axios.get(obj.currentMantenedUrl + '/teste')

    Cons.dev(`[ selectTimer ] REQUEST to api -> ${res.data}`)

    if (send && typeof res.data == 'string')
        await sendTelegramMensage('[HIGH] Funcionando ' + name)

    if (send && typeof res.data != 'string')
        await sendTelegramMensage('Erro em: ' + name)

    } catch {
        await sendTelegramMensage('Erro em: ' + name)
    }
}


// selectTimer(true)//TODO:COMENTEI ESSE E ADICIONEI AO PROGRAM


const ruleRelatory = {
    hour: 14,
    minute: 30,
    second: 0
}

const jobRelatory = schedule.scheduleJob(ruleRelatory, () => selectTimer(true))


export {selectTimer}
