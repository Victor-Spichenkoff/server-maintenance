export interface ITime {
    //quanto ficaram ligados
    thisAccount: number
    mainAccount: number
    usageThisAccount: number
    usageMainAccount: number
    lastStart: number | null
    keepThisApiOn: boolean
    currentMonth: number
}

export type timeKeys = "thisAccount" | "mainAccount" | "usageThisAccount" | "usageMainAccount" | "lastStart" | "keepThisApiOn" | "currentMonth"