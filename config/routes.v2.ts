import {Router} from "express";
import {ActionControllerV2, getAllServers} from "../controllers/actions.v2.controller";

const routesV2 = Router()

routesV2.get("/set/off", ActionControllerV2.setToOff)
// retornam true = setado para true ou false (desligado)
routesV2.get("/set/this/off", ActionControllerV2.setThisToOff)
routesV2.get("/set/this/on", ActionControllerV2.setThisToOn)
routesV2.get("/toggle/all", ActionControllerV2.setToAll)
routesV2.get("/toggle/:id", ActionControllerV2.toggleOne)

// staus
routesV2.get("/status", ActionControllerV2.getAllServers)


routesV2.get("/success-called/:id", ActionControllerV2.setSuccessfullyCalledOne)


export { routesV2 }
