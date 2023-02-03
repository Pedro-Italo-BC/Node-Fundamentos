import http from 'node:http'
import { json } from '../middleware/json.js'
import { extranctQueryParams } from './utils/extract-query-params.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
    const {url, method} = req

    await json(req, res)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if(route){
        const routeParms = req.url.match(route.path)
        
        const {query,...params} = routeParms.groups

        req.params = params ?? {}

        req.query = query ? extranctQueryParams(query) : {}
        
        return route.handler(req,res)
    }

    return res.writeHead(404).end(JSON.stringify({
        menssage: 'Page not found.'
    }))

})

server.listen(3333)

console.log('Running...')