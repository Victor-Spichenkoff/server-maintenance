import { Request, RequestHandler, Response } from "express"
import {db} from "../lib/db";
import {ServerRepository} from "../services/ServersRepository.service";
import {ApiRepository} from "../services/ApiRepository.service";

const toggleOne = async (req: Request, res: any) => {
    const { id } = req.params

    const server = await ServerRepository.getById(Number(id))
    if(server == null)
        return res.status(404).send("Server not found")

    // estava desligado, this pode estar desligado, então garantir que ligará
    if(!server.isActive)
        await ApiRepository.update({ off: false})

    const result = await ServerRepository.toggleItem(server.id, !server.isActive)

    res.send(result.isActive)
}

const toggleAllMain = async (req: Request, res: any) => {
    const servers = await ServerRepository.getAll()
    const markedAsMain = servers.filter(server => server.isMain).length
    const isAllMarkedAsMainActive = servers.filter(server => server.isActive && server.isMain).length == markedAsMain
    if(isAllMarkedAsMainActive)
        await ServerRepository.turnOffAllMarkedAsMain()
    else {
        await ApiRepository.update({ off: false})
        await ServerRepository.setAllMainOn()
    }
    res.send("Set all MAIN API's to: " + !isAllMarkedAsMainActive)
}

const setToOff= async (req: Request, res: any) => {
    await ServerRepository.setToOff()

    res.send("Set to: OFF")
}

const setSuccessfullyCalledOne = async (req: Request, res: any) => {
    const { id } = req.params

    const final = ServerRepository.setSuccessfullyCalledToNow(Number(id))

    res.send("Data updated successfully!")
}

const setThisToOff = async (req: Request, res: any) => {
    const result = await ApiRepository.update({ off: true})
    res.send(!result.off)
}

const setThisToOn = async (req: Request, res: any) => {
    const result = await ApiRepository.update({ off: false})
    res.send(!result.off)
}

export const getAllServers = async (req: Request, res: Response) => {
    const servers = await ServerRepository.getAll()
    res.json(servers)
}

export const ActionControllerV2 = {
    toggleOne,
    setToAll: toggleAllMain,
    setToOff,
    getAllServers,
    setSuccessfullyCalledOne,
    setThisToOff,
    setThisToOn
}
