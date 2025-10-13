

export class Cons {
    static dev (message: string) {
        if (process.env.NODE_ENV === 'development')
            console.log(`Dev: ${message}`)
    }
}
