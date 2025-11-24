import React, { useState, useEffect } from 'react'
import { Typography, Box, TextField, MenuItem, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import { useMask } from '@react-input/mask'
import fetchAuth from '../../lib/fetchAuth'
import ClienteSchema from '../../models/Customer.js'
import { ZodError } from 'zod'

export default function FormularioCliente() {

  const estadosBR = [
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PR', label: 'Paraná' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'SP', label: 'São Paulo' }
  ]

  const cpfRef = useMask({ mask: "###.###.###-##", replacement: { '#': /[0-9]/ }, showMask: false })
  const telefoneRef = useMask({ mask: "(##) %####-####", replacement: { '#': /[0-9]/, '%': /[0-9\s]/ }, showMask: false })

  const formularioInicial = {
    nomeCompleto: '',
    documentoIdentidade: '',
    dataNascimento: null,
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: ''
  }

  const navigate = useNavigate()
  const params = useParams()

  const [formState, setFormState] = useState({
    cliente: { ...formularioInicial },
    alterado: false,
    erros: {}
  })
  const { cliente, alterado, erros } = formState

  useEffect(() => { if(params.id) carregarCliente() }, [])

  async function carregarCliente() {
    feedbackWait(true)
    try {
      const resposta = await fetchAuth.get(`/customers/${params.id}`)
      if(resposta.dataNascimento) resposta.dataNascimento = parseISO(resposta.dataNascimento)
      setFormState({ ...formState, cliente: resposta })
    } catch(err) {
      console.error(err)
      feedbackNotify('Erro ao carregar cliente: ' + err.message)
    } finally { feedbackWait(false) }
  }

  function atualizarCampo(event) {
    const copiaCliente = { ...cliente, [event.target.name]: event.target.value }
    setFormState({ ...formState, cliente: copiaCliente, alterado: true })
  }

  async function enviarFormulario(event) {
    event.preventDefault()
    feedbackWait(true)
    try {
      ClienteSchema.parse(cliente)
      if(params.id) await fetchAuth.put(`/customers/${params.id}`, cliente)
      else await fetchAuth.post('/customers', cliente)
      feedbackNotify('Cliente salvo com sucesso!', 'success', 2500, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    } catch(err) {
      console.error(err)
      if(err instanceof ZodError) {
        const mensagens = {}
        for(let e of err.issues) mensagens[e.path[0]] = e.message
        setFormState({ ...formState, erros: mensagens })
        feedbackNotify('Campos inválidos. Corrija antes de salvar.', 'error')
      } else feedbackNotify(err.message, 'error')
    } finally { feedbackWait(false) }
  }

  async function voltarClick() {
    if(alterado && !await feedbackConfirm('Existem alterações não salvas. Deseja sair?')) return
    navigate('..', { relative: 'path', replace: true })
  }

  return <>
    <Typography variant="h1" gutterBottom>Cadastro de Cliente</Typography>
    <Box className="form-container">
      <form onSubmit={enviarFormulario}>
        <TextField
          variant="outlined"
          name="nomeCompleto"
          label="Nome completo"
          fullWidth
          required
          autoFocus
          value={cliente.nomeCompleto}
          onChange={atualizarCampo}
          error={!!erros?.nomeCompleto}
          helperText={erros?.nomeCompleto}
        />

        <TextField
          inputRef={cpfRef}
          variant="outlined"
          name="documentoIdentidade"
          label="CPF"
          fullWidth
          required
          value={cliente.documentoIdentidade}
          onChange={atualizarCampo}
          error={!!erros?.documentoIdentidade}
          helperText={erros?.documentoIdentidade}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DatePicker
            label="Data de nascimento"
            value={cliente.dataNascimento}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                error: !!erros?.dataNascimento,
                helperText: erros?.dataNascimento
              }
            }}
            onChange={date => atualizarCampo({ target: { name: 'dataNascimento', value: date } })}
          />
        </LocalizationProvider>

        <TextField
          variant="outlined"
          name="logradouro"
          label="Logradouro"
          fullWidth
          required
          value={cliente.logradouro}
          onChange={atualizarCampo}
          error={!!erros?.logradouro}
          helperText={erros?.logradouro}
        />

        <TextField
          variant="outlined"
          name="numero"
          label="Número"
          fullWidth
          required
          value={cliente.numero}
          onChange={atualizarCampo}
          error={!!erros?.numero}
          helperText={erros?.numero}
        />

        <TextField
          variant="outlined"
          name="complemento"
          label="Complemento"
          fullWidth
          value={cliente.complemento}
          onChange={atualizarCampo}
          error={!!erros?.complemento}
          helperText={erros?.complemento}
        />

        <TextField
          variant="outlined"
          name="bairro"
          label="Bairro"
          fullWidth
          required
          value={cliente.bairro}
          onChange={atualizarCampo}
          error={!!erros?.bairro}
          helperText={erros?.bairro}
        />

        <TextField
          variant="outlined"
          name="cidade"
          label="Cidade"
          fullWidth
          required
          value={cliente.cidade}
          onChange={atualizarCampo}
          error={!!erros?.cidade}
          helperText={erros?.cidade}
        />

        <TextField
          variant="outlined"
          name="estado"
          label="Estado"
          fullWidth
          required
          select
          value={cliente.estado}
          onChange={atualizarCampo}
          error={!!erros?.estado}
          helperText={erros?.estado}
        >
          {estadosBR.map(e => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
        </TextField>

        <TextField
          inputRef={telefoneRef}
          variant="outlined"
          name="telefone"
          label="Telefone"
          fullWidth
          required
          value={cliente.telefone}
          onChange={atualizarCampo}
          error={!!erros?.telefone}
          helperText={erros?.telefone}
        />

        <TextField
          variant="outlined"
          name="email"
          label="E-mail"
          fullWidth
          required
          value={cliente.email}
          onChange={atualizarCampo}
          error={!!erros?.email}
          helperText={erros?.email}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="secondary" type="submit">Salvar</Button>
          <Button variant="outlined" onClick={voltarClick}>Voltar</Button>
        </Box>
      </form>
    </Box>
  </>
}
