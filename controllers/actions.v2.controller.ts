import { Request, RequestHandler, Response } from "express"
import {db} from "../lib/db";
import {ServerRepository} from "../services/ServersRepository.service";

const toggleOne = async (req: Request, res: any) => {
    const { id } = req.params

    await db.$executeRaw`
          UPDATE "Server"
          SET "isActive" = NOT "isActive"
          WHERE id = ${Number(id)}
    `

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
    res.send(servers)
}

export const ActionControllerV2 = {
    toggleOne,
    setToAll,
    setToOff,
    getAllServers,
    setSuccessfullyCalledOne
}
