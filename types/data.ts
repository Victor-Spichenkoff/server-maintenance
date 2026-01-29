export type ApiName = 'Portfolios Api' | 'VSS Articles'
    | 'Shopping List' | 'Pagination' | "all" | "Z"
    | "Tic Tac Toe" | "Million" | "Nothing Selected"

export interface IData {
    id?: number
    currentMantenedUrl: string
    currentMantenedName: ApiName,
    off: boolean,
    hightMenssages: boolean
    keepThisApiOn: boolean
}
