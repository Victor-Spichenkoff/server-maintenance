import { Request, RequestHandler, Response } from "express"
import {db} from "../lib/db";
import {ServerRepository} from "../services/ServersRepository.service";

const toggleOne = async (req: Request, res: any) => {
    const { id } = req.params

    const server = await ServerRepository.getById(Number(id))
    if(server == null)
        return res.status(404).send("Server not found")

    await ServerRepository.toggleItem(server.id, !server.isActive)

    res.send("Updated successfully")
}

const setToAll = async (req: Request, res: any) => {
    await ServerRepository.setToAll()

    res.send("Set to: ALL")
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

export const getAllServers = async (req: Request, res: Response) => {
    const servers = await ServerRepository.getAll()
    res.json(servers)
}

export const ActionControllerV2 = {
    toggleOne,
    setToAll,
    setToOff,
    getAllServers,
    setSuccessfullyCalledOne
}
