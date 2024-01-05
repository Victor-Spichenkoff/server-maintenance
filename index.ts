import express from "express"
import verifyAllUrls from "./functions/verify"
const app = express()

// try{
//     console.log(verifyAllUrls())
// } catch(e) {
//     console.log(e)
// }

app.get('/teste', (req, res) => res.send('olá'))

app.listen(process.env.PORT || 2006, () => console.log('Rodando na porta 2006'))