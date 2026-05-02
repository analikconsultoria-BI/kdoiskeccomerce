import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_chars_long!' // Deve ter 32 caracteres no .env
const IV_LENGTH = 16

export function encrypt(text: string) {
  if (!text) return text
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string) {
  if (!text) return text
  const textParts = text.split(':')
  const ivPart = textParts.shift()
  if (!ivPart) return text
  
  try {
    const iv = Buffer.from(ivPart, 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch (e) {
    console.error('Falha ao descriptografar:', e)
    return text // fallback para texto original caso falhe
  }
}

export function maskCpf(cpf: string) {
  if (!cpf) return ''
  // 123.456.789-00 -> ***.456.789-**
  return `***.${cpf.substring(4, 11)}-**`
}
