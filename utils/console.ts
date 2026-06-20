import {BLUE, BLUE_BG, RED, RED_BG, RESET, YELLOW} from "../global";


export class Cons {
    static dev (message: string) {
        if (process.env.NODE_ENV === 'development')
            console.log(`Dev: ${message}`)
    }

    static Red(message: string) {
        console.log(`${RED}${message}${RESET}`)
    }

    static Blue(message: string) {
        console.log(`${BLUE}${message}${RESET}`)
    }

    static Yellow(message: string) {
        console.log(`${YELLOW}${message}${RESET}`)
    }

    static RedBackground(message: string) {
        console.log(`${RED_BG}${message}${RESET}`)
    }

    static BlueBackground(message: string) {
        console.log(`${BLUE_BG}${message}${RESET}`)
    }
}
