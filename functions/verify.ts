import axios from 'axios'
import Urls from "./urls"
const data = new Urls()

function compareResponse(res: any) {
    // console.log(res.data)
    if(typeof res.data == 'string') return 0

    return 1
}


async function verify() {
  try {
    const array = data.urls.map(async (url, i) => {
      try {
        if(data.ignoreIndex.includes(i)) return 0//ignore me

        const res = await axios(url + '/teste')
        const returned = await compareResponse(res)
        return returned
      } catch (err) {
        console.log('Erro: Na busca')
        return 1
      }
    })
    

    const statusArray = await Promise.all(array)

    return statusArray
  } catch (err) {
    console.log('Erro ao aguardar todas as promises')
  }
}


async function wrongUrls() {
    const allStatus = await verify()
    // console.log(allStatus)
    
    var allWrong: any = {}

    allStatus?.forEach((status, i) => {
        if(status) {
            allWrong[`${data.getApi(i)}`] = data.getUrl(i)
        } 
    })

    // console.log('Não funcionaram: '+allWrong)

    return allWrong
}




// wrongUrls()

// export {  }
export default  wrongUrls