const schedule = require('node-schedule')
import wrongUrls from './verify'
import formatMensageAndSend from './sendToPhone'
import axios from 'axios'

var times = 0

async function verifyAndSend(sendMensage: boolean=false) {
    const objectWithWrong = await wrongUrls()

    times++

    if(sendMensage) axios.get('https://server-maintenance.onrender.com/load')
    if(sendMensage) formatMensageAndSend(objectWithWrong, times)
}



// Agendando a primeira execução
const rule1 = {
    // hour: 20,
    minute: 30,
    second: 0    
}

const job1 = schedule.scheduleJob(rule1, verifyAndSend)

// Segunda execução (metodo 2)
const rule2 = new schedule.RecurrenceRule()
// rule2.hour = 8
rule2.minute = 0
rule2.second = 0


const job2 = schedule.scheduleJob(rule2, ()=>verifyAndSend(true))


