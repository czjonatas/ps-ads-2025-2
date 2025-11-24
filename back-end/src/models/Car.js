import prisma from '../database/client.js'
import VeiculoSchema from '../models/Car.js'
import { ZodError } from 'zod'

const veiculosController = {}

veiculosController.adicionar = async (req, res) => {
  try {
    if (req.body.dataVenda) {
      req.body.dataVenda = new Date(req.body.dataVenda)
    }

    VeiculoSchema.parse(req.body)
    await prisma.car.create({ data: req.body })

    res.status(201).end()
  } 
  catch (err) {
    console.error(err)

    if (err instanceof ZodError) {
      return res.status(422).json(err.issues)
    }

    res.status(500).end()
  }
}

veiculosController.listarTodos = async (req, res) => {
  try {
    const registros = await prisma.car.findMany({
      orderBy: [{ brand: 'asc' }]
    })

    res.send(registros)
  } 
  catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

veiculosController.listarUm = async (req, res) => {
  try {
    const registro = await prisma.car.findUnique({
      where: { id: Number(req.params.id) }
    })

    if (registro) res.send(registro)
    else res.status(404).end()
  } 
  catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

veiculosController.atualizar = async (req, res) => {
  try {
    if (req.body.dataVenda) {
      req.body.dataVenda = new Date(req.body.dataVenda)
    }

    VeiculoSchema.parse(req.body)
    await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    res.status(204).end()
  } 
  catch (err) {
    console.error(err)

    if (err.code === 'P2025') return res.status(404).end()
    if (err instanceof ZodError) return res.status(422).json(err.issues)

    res.status(500).end()
  }
}

veiculosController.remover = async (req, res) => {
  try {
    await prisma.car.delete({
      where: { id: Number(req.params.id) }
    })

    res.status(204).end()
  } 
  catch (err) {
    console.error(err)

    if (err.code === 'P2025') return res.status(404).end()
    res.status(500).end()
  }
}

export default veiculosController
