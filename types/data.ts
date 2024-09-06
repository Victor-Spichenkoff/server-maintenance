export type ApiName = 'Portfolio Api' | 'VSS Artigos' | 'Lista Mercado' | 'Paginação' | "all"

export interface IData {
    currentMantenedUrl: string
    currentMantenedName: ApiName | "Nenhum Selecionado",
    off: boolean,
    hightMenssages: boolean
    keepThisApiOn: boolean
}