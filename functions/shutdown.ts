import {Cons} from "../utils/console";
import {discountFromApisV2} from "../services/times.service";
import {TimeRepository} from "../services/TimeRepository.service";


export const onShutdown = async () => {
    // salvar modificações no DB
    await discountFromApisV2()
    await TimeRepository.update({lastDiscount: null})// para evitar descontos no momento errado

    Cons.Red("[SHUTDOWN] RECEBIDO SINAL PARA DESLIGAR. PROCEDIMENTO REALIZADO!")
    process.exit(0);
}
