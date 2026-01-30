export type ApiName = 'Portfolios Api' | 'VSS Articles'
    | 'Shopping List' | 'Pagination' | "All" | "Z"//TODO CHANGE all -> all
    | "Tic Tac Toe" | "Million" | "Nothing Selected"

export interface IData {
    id?: number
    currentMaintainedUrl: string
    currentMaintainedName: ApiName,
    off: boolean,
    highMenssages: boolean
    keepThisApiOn: boolean
}
