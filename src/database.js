import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search, searchMode = 'not-specific'){
        let data = this.#database[table] ?? []

        const someSearchObjectValuesAreUndefined = Object.entries(search).some(([key,_]) => {
            return search[key] === undefined
        })

        if(typeof search === 'object' && search && !someSearchObjectValuesAreUndefined){
            data = data.filter(row => {
                if(searchMode === 'not-specific'){
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                }) }

                if(searchMode === 'specific'){
                    return Object.entries(search).every(([key, value]) => {
                        return row[key] === value
                    }) }
            })
        }

        return data
    }
    
    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else {
            this.#database[table] = [data]
        }

        this.#persist()
    }

    update(table, id, data){
        const index = this.#database[table].findIndex(task => {
            return task.id === id
        })

        if(index > -1){
            this.#database[table][index] = {...this.#database[table][index], ...data}
            this.#persist()        
        }
    }

    delete(table, id){
        const index = this.#database[table].findIndex(task => {
            return task.id === id
        })

        if(index > -1){
            this.#database[table].splice(index, 1)
            this.#persist()
        }
    }
}