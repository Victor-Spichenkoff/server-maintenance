import {BLUE, BLUE_BG, RED, RED_BG, RESET, YELLOW} from "../global";


export class Cons {
    static dev (message: string) {
        if (process.env.NODE_ENV === 'development')
            console.log(`Dev: ${message}`)
    }

    /*
    * Automaticamente coloca a data atual
    * */
    static Log(message: string) {
        console.log(`${this.getTime(true)}  ${message}`)
    }

    static Error(message: string, err?: Error | any) {
        console.log(`${this.getTime(true)}  ${RED}${message}${RESET}  \n${err.stack} \n`)
    }

    static Red(message: string, showTime: boolean = false) {
        console.log(`${this.getTime(showTime)} ${RED}${message}${RESET} `);
    }

    static Blue(message: string, showTime: boolean = false) {
        console.log(`${this.getTime(showTime)} ${BLUE}${message}${RESET}`)
    }

    static Yellow(message: string, showTime: boolean = false) {
        console.log(`${this.getTime(showTime)} ${YELLOW}${message}${RESET}`)
    }

    static RedBackground(message: string, showTime: boolean = false) {
        console.log(`${this.getTime(showTime)} ${RED_BG}${message}${RESET}`)
    }

    static BlueBackground(message: string, showTime: boolean = false) {
        console.log(`${this.getTime(showTime)} ${BLUE_BG}${message}${RESET}`)
    }

    static getTime(show: boolean = false) {
        if(!show)
            return ""

        return `[ ${new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(new Date())} ]`
    }
}
