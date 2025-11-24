import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

// Limites de idade: mínimo 18 anos, máximo 120 anos
const dataMaximaNascimento = new Date()
dataMaximaNascimento.setFullYear(dataMaximaNascimento.getFullYear() - 18)

const dataMinimaNascimento = new Date()
dataMinimaNascimento.setFullYear(dataMinimaNascimento.getFullYear() - 120)

// Estados do Brasil
const estadosBR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]

const ClienteSchema = z.object({
  nome: z.string()
    .trim()
    .min(5, { message: 'Nome deve ter no mínimo 5 caracteres.' })
    .max(100, { message: 'Nome não pode ultrapassar 100 caracteres.' })
    .refine(val => val.includes(' '), { message: 'Nome deve conter espaço entre nome e sobrenome.' }),

  documentoIdentidade: z.string()
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 14, { message: 'CPF deve ter exatamente 14 caracteres.' })
    .refine(val => cpf.isValid(val), { message: 'CPF inválido.' }),

  dataNascimento: z.coerce.date()
    .min(dataMinimaNascimento, { message: 'Data de nascimento muito antiga.' })
    .max(dataMaximaNascimento, { message: 'Cliente precisa ter ao menos 18 anos.' })
    .optional(),

  logradouro: z.string()
    .trim()
    .min(1, { message: 'Logradouro precisa ter pelo menos 1 caractere.' })
    .max(40, { message: 'Logradouro pode ter no máximo 40 caracteres.' }),

  numeroImovel: z.string()
    .trim()
    .min(1, { message: 'Número do imóvel precisa ter pelo menos 1 caractere.' })
    .max(10, { message: 'Número do imóvel pode ter no máximo 10 caracteres.' }),

  complemento: z.string()
    .trim()
    .max(20, { message: 'Complemento pode ter no máximo 20 caracteres.' })
    .optional(),

  bairro: z.string()
    .trim()
    .min(1, { message: 'Bairro precisa ter pelo menos 1 caractere.' })
    .max(25, { message: 'Bairro pode ter no máximo 25 caracteres.' }),

  cidade: z.string()
    .trim()
    .min(1, { message: 'Município precisa ter pelo menos 1 caractere.' })
    .max(40, { message: 'Município pode ter no máximo 40 caracteres.' }),

  uf: z.enum(estadosBR, { message: 'Estado inválido.' }),

  telefone: z.string()
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 15, { message: 'Telefone deve ter 15 caracteres exatos.' }),

  email: z.string()
    .email({ message: 'E-mail inválido.' })
})

export default ClienteSchema
