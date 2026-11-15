import {Cons} from "../utils/console";
import {discountFromApisV2} from "../services/times.service";
import {TimeRepository} from "../services/TimeRepository.service";
import {sendTelegramMessage} from "../lib/sendToPhone";


export const onShutdown = async (reason: string = "Não informado") => {
    // salvar modificações no DB
    await discountFromApisV2()
    await TimeRepository.update({lastDiscount: null})// para evitar descontos no momento errado

    Cons.Red(`[SHUTDOWN] RECEBIDO SINAL: ${reason} - PROCEDIMENTOS REALIZADOS!`)
    await sendTelegramMessage("A API será desligada por: " + reason)
    process.exit(0);
}
