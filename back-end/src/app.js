// Carregando as variáveis de ambiente do arquivo.env
import dotenv from 'dotenv'
dotenv.config()
import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'

const app = express()


// Configurando o CORS para aceitar requisições a partir
// dos servidores configurados na variável de ambiente
// ALLOWED_ORIGINS
import cors from 'cors'
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true   // Habilita o envio de cookies para o front-end
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)

/***************ROTAS***************/
// Middleware de verificação de autorização
import auth from './middleware/auth.js'
app.use(auth)

/**Rota Customers */
import customersRoute from './routes/customers.js'
app.use('/customers', customersRoute)

/**Rota Cars */
import carsRoute from './routes/cars.js'
app.use('/cars', carsRoute)

/**Rota Users */
import usersRoute from './routes/users.js'
app.use('/users', usersRoute)

/**Rota Sellers */
import sellersRoute from './routes/sellers.js'
app.use('/sellers', sellersRoute)

export default app