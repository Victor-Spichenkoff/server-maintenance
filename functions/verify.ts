import axios from 'axios'
import Urls from "./urls"
const data = new Urls

function compareResponse(res: any) {
    // console.log(res.data)
    if(typeof res.data == 'string') return 0

    return 1
}

// export default class VerifyAllUrls {
//     public erro: number
//     seconds: number
//     timer: any

//     constructor(erro = 0, seconds=0, timer='') {
//         this.erro = erro
//         this.seconds = seconds
//         this.timer = timer
//     }

//     async verify() {
//         this.timer = setInterval(() => this.seconds+=2, 2000)
    
    
//         data.urls.forEach((url, i) => {
//             axios(url+'/teste')
//                 .then(res => compareResponse(res))
//                 .then(returned => this.erro = 1)
//                 .catch(res=> {
//                     console.log('cATCH')
//                     this.erro += 1
//                 })
            
//             if(this.erro)  throw 'Erro em: '+ data.getApi(i)
            
//         })
    
//         console.log(this.erro, this.seconds)
//         clearInterval(this.timer)
    
//         if(this.erro) return
    
//         return 'Success'
//     }

// }
export default function verifyAllUrls() {
    var erro = 0
    var seconds = 0

    let timer = setInterval(()=> {
        console.log('+1')
        seconds+=.5
    }, 2000)


    const array = data.urls.map(async (url, i) => {
        var currentStatus = 1
        await axios(url+'/teste')
            .then(res => compareResponse(res))
            .then(returned => {
                currentStatus = returned
                console.log(returned)
            })
            .catch(res=> {
                console.log('cATCH')
                erro += 1
            })
        
        return currentStatus
        // if(erro)  throw 'Erro em: '+ data.getApi(i)
    })

    setTimeout(()=> {
        clearInterval(timer)
    }, 3000)
    
    console.log(erro, seconds, array)
    if(erro) return

    return 'Success'
}
// const verifyAllUrls = new VerifyAllUrls()

// console.log(verifyAllUrls.verify())
console.log(verifyAllUrls())