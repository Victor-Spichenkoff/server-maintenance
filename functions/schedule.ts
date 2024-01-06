const schedule = require('node-schedule')
import wrongUrls from './verify'
import formatMensageAndSend from './sendToPhone'

var times = 0

async function verifyAndSend(sendMensage: boolean=false) {
    const objectWithWrong = await wrongUrls()

    times++

    if(sendMensage) formatMensageAndSend(objectWithWrong, times)
}



// Agendando a primeira execução
const rule1 = {
    hour: 20,
    minute: 49,
    second: 40    
}

const job1 = schedule.scheduleJob(rule1, verifyAndSend)

// Segunda execução (metodo 2)
const rule2 = new schedule.RecurrenceRule()
rule2.hour = 8
rule2.minute = 0
rule2.second = 0


const job2 = schedule.scheduleJob(rule2, ()=>verifyAndSend(true))


