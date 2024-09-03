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


function keepThisOn() {
    axios.get(thisUrl)
}

keepThisOn()//já carrega esse


async function verifyAndSendAll(sendMensage: boolean=false) {
    const objectWithWrong = await wrongUrls()

    times++

    if(sendMensage) formatMensageAndSend(objectWithWrong, times)
    setTimeout(()=> {
        axios.get(thisUrl+'/load')
    }, 1000 * 60 * 12)//12 minutos
}



async function setOne(index: number, res: any) {
    console.log('Index: '+ index)
    console.log('Nome: '+ data.getApi(index))

    let url = data.getUrl(index)

    const resApi = await axios.get(url+'/teste')

    await write('currentMantenedUrl', url)
    await write('currentMantenedName', data.getApi(index))
    await write('off', false)

    sendTelegramMensage('Setado para: '+ (data.getApi(index)).toUpperCase())

    selectTimer()
  
    // if(typeof resApi.data == 'string') res.send('Tudo certo em: ' + data.getApi(index))
    // else res.status(500).send('Erro em ' + data.getApi(index))
}


async function setAll(res: Response) {
    await write('currentMantenedName', 'all')
    await write('off', false)

    sendTelegramMensage('Setado para TODOS')
    res.send('Setado para todos')
}



async function turnOf(req?:Request, res?: Response) {
    await write('off', true)
    await write('currentMantenedUrl', 'https://google.com')
    await write('currentMantenedName', 'Nenhum Selecionado')

    sendTelegramMensage('Tudo OFF')
    res?.status(203)
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
async function makeRecursiveRequest(UseStoraged = false, url = '', count:number=0) {
    const res = await axios.get(url +'/teste')
    if(res) return count++
    const timeOut = setTimeout(() => {
        makeRecursiveRequest(false, url)
    }, 3000)
}


async function forceLoadAllOnce(req:any, res:any) {
    const urls = data.urls
    var successUrlsCount = 0
    var times = 0

    urls.forEach(url => {
        makeRecursiveRequest(false, url, successUrlsCount)
    })
    const interval = setInterval(() => {
        if(successUrlsCount >= urls.length) {
            res.send('Todas as reqs foram feitas')
            sendTelegramMensage('Todas as reqs foram feitas')
            clearInterval(interval)
        }
        times++
        if(times > 20) {
            res.send("Erro no req de todos")
            sendTelegramMensage('Erro no req de todos')
            clearInterval(interval)
        }
    }, 1000)
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

    keepThisOn()

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
    const res = await axios.get(obj.currentMantenedUrl+ '/teste')
    if(send && typeof res.data == 'string') sendTelegramMensage('Funcionando ' + name)
    if(send && typeof res.data != 'string') sendTelegramMensage('Erro em: ' + name)
}

selectTimer(true)



// const rule1 = {
//     // hour: 20,
//     minute: 0,
//     second: 0    
// }

// const job1 = schedule.scheduleJob(rule1, ()=> selectTimer(true))

// // Segunda execução (metodo 2)
// const rule2 = new schedule.RecurrenceRule()
// // rule2.hour = 8
// rule2.minute = 12
// rule2.second = 0


// const job2 = schedule.scheduleJob(rule2, selectTimer)


// const rule3 = {
//     minute: 24,
//     second: 0
// }

// const job3 = schedule.scheduleJob(rule3, selectTimer)


// const rule4 = {
//     minute: 36,
//     second: 0
// }

// const job4 = schedule.scheduleJob(rule4, selectTimer)



// const rule5 = {
//     minute: 48,
//     second: 0
// }

// const job5 = schedule.scheduleJob(rule5, selectTimer)


const ruleRelatory = {
    hour: 14,
    minute: 30,
    second: 0
}

const jobRelatory = schedule.scheduleJob(ruleRelatory , ()=> selectTimer(true))


// const minute = 1000 * 60 
let vezes = 0


// setTimeout(()=>{
//     setInterval(()=> {
//         selectTimer(true)
//     }, minute * 15)
// }, 0)


// setTimeout(()=>{
//     setInterval(()=> {
//         selectTimer()
//     }, minute * 12)
// }, minute * 12)


// setTimeout(()=>{
//     setInterval(()=> {
//         selectTimer()
//     }, minute * 12)

// }, minute * 24)


// setTimeout(()=>{
//     setInterval(()=> {
//         selectTimer()
//     }, minute * 12)

// }, 36)


// setTimeout(()=>{
//     setInterval(()=> {
//         selectTimer(true)
//         sendTelegramMensage('48 Minutos')
//     }, minute * 12)

// }, minute * 48)






export { setOne, turnOf,setAll, selectTimer, forceLoadAllOnce }