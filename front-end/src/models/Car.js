import { z } from "zod";

const coresDisponiveis = [
  "AMARELO","AZUL","BRANCO","CINZA","DOURADO",
  "LARANJA","MARROM","PRATA","PRETO",
  "ROSA","ROXO","VERDE","VERMELHO"
];

const dataAberturaLoja = new Date(2020, 2, 20) // 20/03/2020
const dataHoje = new Date()
const anoAtual = dataHoje.getFullYear()

const VeiculoSchema = z.object({
  marca: z.string()
    .trim()
    .min(1, { message: "Marca precisa ter pelo menos 1 caractere." })
    .max(25, { message: "Marca pode ter no máximo 25 caracteres." }),

  modelo: z.string()
    .trim()
    .min(1, { message: "Modelo precisa ter pelo menos 1 caractere." })
    .max(25, { message: "Modelo pode ter no máximo 25 caracteres." }),

  cor: z.enum(coresDisponiveis, { message: "Cor inválida. Escolha uma das cores disponíveis." }),

  anoFabricacao: z.coerce.number({
      required_error: "Ano de fabricação é obrigatório.",
      invalid_type_error: "Ano deve ser um número."
    })
    .int({ message: "Ano precisa ser inteiro." })
    .min(1960, { message: "Ano mínimo é 1960." })
    .max(anoAtual, { message: `Ano não pode ser maior que ${anoAtual}.` }),

  importado: z.boolean({
    required_error: "Campo 'importado' obrigatório.",
    invalid_type_error: "Valor deve ser true ou false."
  }),

  placa: z.string()
    .trim()
    .length(8, { message: "Placa precisa ter exatamente 8 caracteres." }),

  dataVenda: z.coerce.date()
    .min(dataAberturaLoja, { message: "Data não pode ser anterior à abertura da loja." })
    .max(dataHoje, { message: "Data não pode ser futura." })
    .optional(),

  precoVenda: z.coerce.number()
    .min(5000, { message: "Preço mínimo R$ 5.000,00." })
    .max(5000000, { message: "Preço máximo R$ 5.000.000,00." })
    .optional()
})

export default VeiculoSchema
