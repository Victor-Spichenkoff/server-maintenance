import axios from 'axios'
const schedule = require('node-schedule')
import wrongUrls from './verify'
import formatMensageAndSend, { sendTelegramMensage } from './sendToPhone'
import Urls from "./urls"
import { getData, write } from './manegeData'
import { Request, Response } from 'express'
const data = new Urls()


const thisUrl = 'https://server-maintenance-ssu7.onrender.com'
// const thisUrl = 'https://server-maintenance.onrender.com'//old

var times = 0
var first = true


export function callThis() {
    axios.get(thisUrl)
}

callThis()//já carrega esse


async function verifyAndSendAll(sendMensage: boolean=false) {
    const objectWithWrong = await wrongUrls()

    times++

    if(sendMensage) formatMensageAndSend(objectWithWrong, times)
    setTimeout(()=> {
        axios.get(thisUrl+'/load')
    }, 1000 * 60 * 12)//12 minutos
}












async function makeInitialRequests() {
    const obj = await getData()
    try{
        return await axios.get(obj.currentMantenedUrl+ '/teste')
    } catch(e) {
        return false
    }
}


//testar essas duas
export async function makeRecursiveRequest(UseStoraged = false, url = '', count:number=0) {
    const res = await axios.get(url +'/teste')
    if(res) return count++
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


    if(obj.off) {
        sendTelegramMensage('Desligando servidor (obj.off == true)')
        if(send) sendTelegramMensage('Desativado')
        return
    }
    

    //desativar no dev
    if(process.env.NOT_REQ)
        return




    //varias requests(iniciais)
    var vezes = 0
    if(first) {
        var firstRequests = setInterval(async () => {
            vezes++
            if(vezes > 10) {
                sendTelegramMensage('Nã foi possível fazer o Initial Request')
                clearInterval(firstRequests)
            }
            //requests e tratemento
            const res = await makeInitialRequests()
            if(res) {
                first = false
                sendTelegramMensage('Fisrt feito em: '+  name)
                clearInterval(firstRequests)
            }
        }, 3000)
    }

    callThis()

    setTimeout(()=> {
        //pediu para sempre enviar
        if(obj.hightMenssages) {
            selectTimer(true)
        }
        const rightHours = hour == 11 || hour == 15 || hour == 22

        if(rightHours && min > 0 && min < 14) {// 11 = 8horas no Brasil
            selectTimer(true)
            sendTelegramMensage('SelectTimer '+ hour + ' : ' +min)
           
        } else selectTimer()

    }, 1000 * 60 * 12)


    if(obj.currentMantenedName == 'all') return verifyAndSendAll(send) 

    //para não consumir, desligar em testes
    if(process.env.NOT_REQ)
        return
    const res = await axios.get(obj.currentMantenedUrl+ '/teste')
    if(send && typeof res.data == 'string') sendTelegramMensage('Funcionando ' + name)
    if(send && typeof res.data != 'string') sendTelegramMensage('Erro em: ' + name)
}


if(!process.env.NOT_REQ)
    selectTimer(true)


const ruleRelatory = {
    hour: 14,
    minute: 30,
    second: 0
}

const jobRelatory = schedule.scheduleJob(ruleRelatory , ()=> selectTimer(true))


export { selectTimer }