import { Request, RequestHandler, Response } from "express"
import {db} from "../lib/db";
import {ServerRepository} from "../services/ServersRepository.service";
import {ApiRepository} from "../services/ApiRepository.service";
import {TimeRepository} from "../services/TimeRepository.service";

const toggleOne = async (req: Request, res: any) => {
    const { id } = req.params

    const server = await ServerRepository.getById(Number(id))
    if(server == null)
        return res.status(404).send("Server not found")

    // estava desligado, this pode estar desligado, então garantir que ligará
    if(!server.isActive)
        await TimeRepository.setKeepThisOn()

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
        await TimeRepository.setKeepThisOn()
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
    await TimeRepository.turnOffThisApi()
    await ServerRepository.setToOff()
    res.send(false)
}

const setThisToOn = async (req: Request, res: any) => {
    await TimeRepository.setKeepThisOn()
    res.send(true)
}

export const getAllServers = async (req: Request, res: Response) => {
    const servers = await ServerRepository.getAll()
    res.json(servers)
}

export const successfullyCalled = async (req: Request, res: Response) => {
    const { id } = req.params
    await ServerRepository.setSuccessfullyCalledToNow(Number(id))
    res.json("Updated!")
}

export const ActionControllerV2 = {
    toggleOne,
    setToAll: toggleAllMain,
    setToOff,
    getAllServers,
    setSuccessfullyCalledOne,
    setThisToOff,
    setThisToOn,
    successfullyCalled
}
