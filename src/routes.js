import { Database } from "./database.js"
import {randomUUID} from 'node:crypto'
import {buildRoutePath} from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req,res) => {
            const {search} = req.query

            const data = database.select('tasks', {
                title: search,
                description: search
            })

            return res.writeHead(200).end(JSON.stringify(data))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req,res) => {
            const {title, description} = req.body

            if(!title){
                return res.writeHead(400).end(JSON.stringify({
                    message :'You need to inform the title.'
                }))
            }

            if(!description){
                return res.writeHead(400).end(JSON.stringify({
                    message :'You need to inform the description.'
                }))
            }

            const [searchResponse] = database.select('tasks', {
                title,
                description
            }, 'specific')

            if(!!searchResponse){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Task aredy exist.'
                }))
            }

            const data = {
                id: randomUUID(),
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: null,
                title: title,
                description: description
            }


            database.insert('tasks', data)
            
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const {id} = req.params
            const {title, description} = req.body

            if(!id){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Id not found.'
                }))  
            }

            if(!title){
                return res.writeHead(400).end(JSON.stringify({
                    message :'You need to inform the title.'
                }))
            }

            if(!description){
                return res.writeHead(400).end(JSON.stringify({
                    message:'You need to inform the description.'
                }))
            }

            const [searchResponse] = database.select('tasks', {
                title,
                description
            }, 'specific')

            if(!!searchResponse){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Task aredy exist.'
                }))
            }

            const [response] = database.select('tasks', {
                id
            }, 'specific')

            if(!response){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }
            const data = {
                title,
                description,
                updated_at: new Date()
            }

            database.update('tasks', id, data)


            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const {id} = req.params

            if(!id){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Id not found.'
                }))
            }

            const [response] = database.select('tasks', {
                id
            }, 'specific')

            if(!response) {
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }

            database.delete('tasks', id)


            return res.writeHead(201).end()

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req,res) => {
            const {id} = req.params

            if(!id){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Id not found.'
                }))
            }

            const [response] = database.select('tasks', {
                id
            }, 'specific')

            if(!response){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }

            const data = {
                updated_at: new Date(),
                completed_at: response.completed_at ? null : new Date()
            }

            database.update('tasks', id, data)

            return res.writeHead(204).end() 
        }
    },
]