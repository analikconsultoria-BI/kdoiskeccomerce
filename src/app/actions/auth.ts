'use server'

import { createClient } from '@/lib/supabase-server'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'
import { encrypt } from '@/lib/encryption'
import { revalidatePath } from 'next/cache'

// Auxiliar para mascarar erros (Segurança)
function getGenericError() {
  return { error: 'Email ou senha incorretos.' }
}

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Dados inválidos.' }
  }

  const supabase = await createClient()
  
  // Limpar tokens/cookies antigos antes de um novo login
  await supabase.auth.signOut()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    console.error(`[SECURITY] Falha de login para ${parsed.data.email}: ${error.message}`)
    return getGenericError()
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = registerSchema.safeParse({
    ...data,
    aceiteTermos: data.aceiteTermos === 'on' || data.aceiteTermos === 'true',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  // 1. Criar usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nome: parsed.data.nome,
      }
    }
  })

  if (authError) {
    console.error(`[SECURITY] Erro no cadastro: ${authError.message}`)
    return { error: 'Não foi possível realizar o cadastro no momento.' }
  }

  if (authData.user) {
    // 2. Criptografar CPF e inserir no Perfil
    const encryptedCpf = encrypt(parsed.data.cpf)
    
    const { error: profileError } = await supabase.from('perfis').insert({
      id: authData.user.id,
      nome: parsed.data.nome,
      cpf: encryptedCpf,
      telefone: parsed.data.telefone
    })

    if (profileError) {
      console.error(`[SECURITY] Erro ao criar perfil: ${profileError.message}`)
      // Dependendo da lógica, pode ser necessário fazer rollback ou lidar com o erro de forma suave
    }
  }

  // Se 'Email Confirmations' estiver ativado no Supabase, avisar o usuário
  return { success: true, message: 'Cadastro realizado. Verifique seu email para confirmar a conta.' }
}

export async function forgotPasswordAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = forgotPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Email inválido.' }
  }

  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/redefinir-senha`,
  })

  if (error) {
    console.error(`[SECURITY] Erro recuperação de senha: ${error.message}`)
  }

  // Sempre retornar sucesso genérico para não vazar emails cadastrados
  return { success: true, message: 'Se o email existir em nossa base, um link de recuperação foi enviado.' }
}

export async function resetPasswordAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = resetPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password
  })

  if (error) {
    console.error(`[SECURITY] Erro ao atualizar senha: ${error.message}`)
    return { error: 'Não foi possível redefinir a senha. O link pode ter expirado.' }
  }
  
  // Deslogar de todas as sessões por segurança após troca de senha
  await supabase.auth.signOut()

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
