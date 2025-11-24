import { z } from 'zod'

const allowedColors = [
  'AMARELO','AZUL','BRANCO','CINZA','DOURADO','LARANJA','MARROM',
  'PRATA','PRETO','ROSA','ROXO','VERDE','VERMELHO'
]

const currentYear = new Date().getFullYear()
const openingDate = new Date('2020-03-20')

export const carSchema = z.object({
  brand: z.string()
    .min(1, { message: 'Marca: pelo menos 1 caractere.' })
    .max(25, { message: 'Marca: no máximo 25 caracteres.' }),

  model: z.string()
    .min(1, { message: 'Modelo: pelo menos 1 caractere.' })
    .max(25, { message: 'Modelo: no máximo 25 caracteres.' }),

  color: z.string()
    .transform(v => String(v ?? '').toUpperCase())
    .refine(v => allowedColors.includes(v), { message: `Cor: deve ser uma das seguintes - ${allowedColors.join(', ')}.` }),

  year_manufacture: z.preprocess(val => {
    // aceita string numérica ou número
    if (typeof val === 'string' && val.trim() !== '') return Number(val)
    return val
  }, z.number({ invalid_type_error: 'Ano de fabricação: deve ser um número inteiro.' }).int({ message: 'Ano de fabricação: deve ser um número inteiro.' }).min(1960, { message: 'Ano de fabricação: mínimo 1960.' }).max(currentYear, { message: `Ano de fabricação: máximo ${currentYear}.` })),

  imported: z.boolean({ invalid_type_error: 'Importado: deve ser true ou false.' }),

  plates: z.string()
    .min(8, { message: 'Placas: deve ter exatamente 8 caracteres.' })
    .max(8, { message: 'Placas: deve ter exatamente 8 caracteres.' }),

  selling_date: z.preprocess(val => {
    if (val == null || val === '') return undefined
    // aceita Date ou string
    const d = val instanceof Date ? val : new Date(val)
    return isNaN(d) ? val : d
  }, z.date().optional().refine(d => {
    if (!d) return true
    return d >= openingDate && d <= new Date()
  }, { message: 'Data de venda: se informada, deve estar entre 20/03/2020 e hoje.' })),

  selling_price: z.preprocess(val => {
    if (val == null || val === '') return undefined
    if (typeof val === 'string') return Number(val)
    return val
  }, z.number().optional().refine(v => {
    if (v == null) return true
    return v >= 5000 && v <= 5000000
  }, { message: 'Preço de venda: se informado, deve estar entre R$ 5.000,00 e R$ 5.000.000,00.' }))
})

export function formatZodErrors(error) {
  // transforma Zod error em objeto simples { campo: mensagem }
  const formatted = {}
  if (!error || !error.errors) return formatted
  for (const e of error.errors) {
    const path = e.path?.[0] ?? '_'
    // prefer first message
    if (!formatted[path]) formatted[path] = e.message
  }
  return formatted
}

export default carSchema
