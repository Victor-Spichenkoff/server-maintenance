import axios from 'axios'
import wrongUrls from './verify'

const telegramBotToken = '6746265132:AAHesfWPU4GGxYyWqnbDZSriNnkFcbRFi0E'

async function sendTelegramMensage(mensagem: string): Promise<void> {
  if(process.env.NOT_SEND) 
    return

  const chatId = '1139085287'

  const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: mensagem,
    }),
  }

  try {
    const response = await axios.post(apiUrl, {
        chat_id: chatId,
        text: mensagem,
      });
    // const responseData = await response.data

    if (response.data.ok) {
      console.log('Mensagem enviada com sucesso.')
    } else {
      console.error('Erro ao enviar mensagem:', response.data.description)
    }
  } catch (error:any) {
    console.error('Erro na requisição:', error.message)
  }
}


function formatMensageAndSend(obj: object,times?: number, onlyReturn = false) {
    if(Object.keys(obj).length == 0) {
        if(onlyReturn) return 'Tudo funcionando nos conformes'

        sendTelegramMensage('Tudo funcionando nos conformes. Vez: '+ times)
    }
    
    const apisNames = Object.keys(obj)
    const apisUrls = Object.values(obj)

    let finalMensage = 'Erros em: \n'

    apisNames.forEach((name, i) => {
        finalMensage += `--> ${name}: ${apisUrls[i]}

`
    })

    if(onlyReturn) return finalMensage
    sendTelegramMensage(finalMensage)
}

export { sendTelegramMensage }
export default formatMensageAndSend
