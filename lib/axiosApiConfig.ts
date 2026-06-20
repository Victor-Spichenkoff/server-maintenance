import axios from "axios"
import {Cons} from "../utils/console";
import {NotReqException} from "./notReqException";

/*
* Comportamento importante:
*  * On NOT_REQ = retorna NULL + avisa no console
*  * Erro real = propaga
* */
const api = axios.create()


/*
* Logar erros
* */
api.interceptors.response.use(
    (response) => {
        Cons.Blue(
        `[${new Date().toISOString()}] ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status}`
        )

        return response
    },
    (error) => {
        // não é erro real, apenas tratamento meu
        if(error instanceof NotReqException) {

            return null
        }
        Cons.Red(
            `[ERROR] [${new Date().toISOString()}] ${error.config?.method?.toUpperCase()} ${error.config?.url} -> ${error.response?.status ?? "NETWORK_ERROR"}`,
        )

        return Promise.reject(error)
    }
)

/*
* Não fazer request, caso NOT_REQ = TRUE
* */
api.interceptors.request.use((config) => {
    if (process.env.NOT_REQ == "true") {
        Cons.Yellow(
            `[ NOT_REQ ]  ${config.method?.toUpperCase()} ${config.url}`
        );

        throw new NotReqException();
    }

    return config;
});

export default api
