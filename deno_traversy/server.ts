import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
const PORT: number = 5000

const app = new Application()

const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods())

router.get('/api/v1', ({ response }: { response: any }) => {
  response.body = 'Hello World'
})

console.log(`Server running on ${PORT}`)

await app.listen({ port: PORT })
