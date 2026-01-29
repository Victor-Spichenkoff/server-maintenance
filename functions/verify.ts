import axios from 'axios'
import {apisInfo, getApiInfoById} from "../data/apisInfo";


function compareResponse(res: any) {
    // console.log(res.data)
    if (typeof res.data == 'string') return 0

    return 1
}


async function verify() {

    try {
        const array = apisInfo.map(async (info) => {
            try {
                if (info.isIgnore) return 0//ignore me

                const res = await axios(info.url + '/teste')
                return compareResponse(res)
            } catch (err) {
                console.log('Erro: Na busca')
                return 1
            }
        })
        //
        // const array = data.urls.map(async (url, i) => {
        //     try {
        //         if (data.ignoreIndex.includes(i)) return 0//ignore me
        //
        //         const res = await axios(url + '/teste')
        //         const returned = await compareResponse(res)
        //         return returned
        //     } catch (err) {
        //         console.log('Erro: Na busca')
        //         return 1
        //     }
        // })


        return await Promise.all(array)// status array
    } catch (err) {
        console.log('Erro ao aguardar todas as promises')
    }
}


async function wrongUrls() {
    const allStatus = await verify()


    let allWrong: any = {}

    allStatus?.forEach((status, i) => {
        if (status) {
            allWrong[`${getApiInfoById(i)}`] = getApiInfoById(i)?.url
            // allWrong[`${data.getApi(i)}`] = data.getUrl(i)
        }
    })

    return allWrong
}


// wrongUrls()

// export {  }
export default wrongUrls
