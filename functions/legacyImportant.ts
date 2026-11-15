import {TimeRepository} from "../services/TimeRepository.service";
import {ServerRepository} from "../services/ServersRepository.service";

export const baseConfigForTimeOnStart = async () => {
    await TimeRepository.update({lastDiscount: null, lastStart: Date.now()})
}
