import {TimeRepository} from "../services/TimeRepository.service";

export const baseConfigForTimeOnStart = async () => {
    if (process.env.DEV == "true") return

    await  TimeRepository.update({lastDiscount: null})
}
