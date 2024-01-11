import axios from 'axios'
const schedule = require('node-schedule')
import wrongUrls from './verify'
import formatMensageAndSend, { sendTelegramMensage } from './sendToPhone'
import Urls from "./urls"
import { getData, write } from './manegeData'
import { Response } from 'express'
const data = new Urls()

var times = 0

const thisUrl = 'https://server-maintenance-ssu7.onrender.com'
// const thisUrl = 'https://server-maintenance.onrender.com'//old


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
    }, 1000 * 60 * 15)//15 minutos
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
  
    // if(typeof resApi.data == 'string') res.send('Tudo certo em: ' + data.getApi(index))
    // else res.status(500).send('Erro em ' + data.getApi(index))
}


async function setAll(res: Response) {
    await write('currentMantenedName', 'all')
    await write('off', false)

    sendTelegramMensage('Setado para TODOS')
    res.send('Setado para todos')
}



async function turnOf() {
    await write('off', true)
    await write('currentMantenedUrl', 'https://google.com')
    await write('currentMantenedName', 'Nenhum Selecionado')

    sendTelegramMensage('Tudo OFF')
}



async function selectTimer(send: boolean = false) {
    const obj = await getData()
    const name = obj.currentMantenedName.toUpperCase()

    if(obj.off) {
        if(send) sendTelegramMensage('Desativado')
        return
    }
    
    if(obj.currentMantenedName == 'all') return verifyAndSendAll(send) 

    //para não consumir, desligar em testes
    const res = await axios.get(obj.currentMantenedUrl+ '/teste')
    if(send && typeof res.data == 'string') sendTelegramMensage('Funcionando ' + name)
    if(send && typeof res.data != 'string') sendTelegramMensage('Erro em: ' + name)


    keepThisOn()
    // setTimeout(() => axios.get(thisUrl+'/'), 1000 * 60 * 15)
}





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


const minute = 1000 * 60 

setTimeout(()=>{
    setInterval(()=> {
        selectTimer(true)
    }, minute * 15)
}, 0)


setTimeout(()=>{
    setInterval(()=> {
        selectTimer()
    }, minute * 12)
}, minute * 12)


setTimeout(()=>{
    setInterval(()=> {
        selectTimer()
    }, minute * 12)

}, minute * 24)


setTimeout(()=>{
    setInterval(()=> {
        selectTimer()
    }, minute * 12)

}, 36)


setTimeout(()=>{
    setInterval(()=> {
        selectTimer(true)
        sendTelegramMensage('48 Minutos')
    }, minute * 12)

}, minute * 48)






export { setOne, turnOf,setAll }