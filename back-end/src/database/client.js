// import { PrismaClient } from '../generated/prisma/default.js'

// const prisma = new PrismaClient({
//   log: [{
//     emit: 'event',
//     level: 'query'
//   }]
// })


import { PrismaClient } from '../generated/prisma/default.js'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaBase = new PrismaClient({
  log: [{
    emit: 'event',
    level: 'query'
  }]
})

// Exibe no terminal as instruções SQL enviadas ao BD
prismaBase.$on('query', event => {
  console.log('-'.repeat(60))
  console.log(event.query)
  if(event.params) console.log('PARAMS:', event.params)
})

const prisma = prismaBase.$extends(withAccelerate())

export default prisma
