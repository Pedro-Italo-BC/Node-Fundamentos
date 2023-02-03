import { parse } from 'csv-parse' 
import fs from 'node:fs'

const tasksFilePath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(tasksFilePath)

const csvOptions = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function postCsvTasks(){
    const lines = stream.pipe(csvOptions)

    for await (const line of lines){
        const [title, description] = line;

         await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title, description})
        })
    } 
}

postCsvTasks()