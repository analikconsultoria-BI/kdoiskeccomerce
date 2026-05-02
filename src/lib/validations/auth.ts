import { z } from 'zod'
import { cpf as cpfValidator } from 'cpf-cnpj-validator'
import DOMPurify from 'isomorphic-dompurify'

// Regras de Senha
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const loginSchema = z.object({
  email: z.string().email('Email inválido.').transform(e => e.toLowerCase().trim()),
  password: z.string().min(1, 'Senha é obrigatória.'),
  remember: z.boolean().optional(),
})

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome completo é obrigatório.').transform(n => DOMPurify.sanitize(n)),
  email: z.string().email('Email inválido.').transform(e => e.toLowerCase().trim()),
  cpf: z.string().refine(val => cpfValidator.isValid(val), {
    message: 'CPF inválido.',
  }),
  telefone: z.string().min(10, 'Telefone inválido.').transform(t => t.replace(/\D/g, '')), // Apenas números
  password: z.string().regex(passwordRegex, 'Senha deve ter no mínimo 8 caracteres, contendo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.'),
  confirmPassword: z.string(),
  aceiteTermos: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso e política de privacidade.',
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido.').transform(e => e.toLowerCase().trim()),
})

export const resetPasswordSchema = z.object({
  password: z.string().regex(passwordRegex, 'Senha deve ter no mínimo 8 caracteres, contendo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
})

export const profileSchema = z.object({
  nome: z.string().min(3, 'Nome completo é obrigatório.').transform(n => DOMPurify.sanitize(n)),
  telefone: z.string().min(10, 'Telefone inválido.').transform(t => t.replace(/\D/g, '')),
})
