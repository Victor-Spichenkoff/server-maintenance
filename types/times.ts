export interface ITime {
    //quanto ficaram ligados
    thisAccount: number
    mainAccount: number
    usageThisAccount: number
    usageMainAccount: number
    lastStart: number | null
    lastDiscount: number | null
    keepThisApiOn: boolean
    currentMonth: number
    alreadyStartedThis: boolean
}

export interface ITimeUpdate {
    //quanto ficaram ligados
    thisAccount?: number
    mainAccount?: number
    usageThisAccount?: number
    usageMainAccount?: number
    lastStart?: number | null
    lastDiscount?: number | null
    keepThisApiOn?: boolean
    currentMonth?: number
    alreadyStartedThis?: boolean
}

export type timeKeys = "thisAccount" | "mainAccount" | "usageThisAccount" | "usageMainAccount" | "lastStart" | "keepThisApiOn" | "currentMonth" | "lastDiscount" | "alreadyStartedThis"