-- Execute este script no SQL Editor do Supabase para atualizar a estrutura do banco

-- Atualizar tabela produtos_config
ALTER TABLE produtos_config
  DROP CONSTRAINT IF EXISTS produtos_config_badge_check;

ALTER TABLE produtos_config
  -- Conteúdo personalizável
  ADD COLUMN IF NOT EXISTS nome_customizado TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS descricao_curta TEXT,
  ADD COLUMN IF NOT EXISTS descricao_completa TEXT,
  ADD COLUMN IF NOT EXISTS beneficios TEXT[],
  ADD COLUMN IF NOT EXISTS especificacoes JSONB DEFAULT '{}'::jsonb,
  
  -- Imagens
  ADD COLUMN IF NOT EXISTS imagens TEXT[],
  ADD COLUMN IF NOT EXISTS imagem_principal TEXT,
  
  -- Preço e promoção
  ADD COLUMN IF NOT EXISTS preco_de NUMERIC,
  ADD COLUMN IF NOT EXISTS pix_desconto_percent NUMERIC DEFAULT 5,
  ADD COLUMN IF NOT EXISTS parcelas_max INTEGER DEFAULT 12,
  ADD COLUMN IF NOT EXISTS parcelas_sem_juros INTEGER DEFAULT 3,
  
  -- Frete
  ADD COLUMN IF NOT EXISTS frete_gratis BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS prazo_entrega_dias INTEGER DEFAULT 7,
  
  -- Vitrine
  ADD COLUMN IF NOT EXISTS ordem_exibicao INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS categoria_customizada TEXT,
  
  -- SEO
  ADD COLUMN IF NOT EXISTS meta_titulo TEXT,
  ADD COLUMN IF NOT EXISTS meta_descricao TEXT,
  
  -- Dados espelhados do Bling
  ADD COLUMN IF NOT EXISTS nome_bling TEXT,
  ADD COLUMN IF NOT EXISTS preco_bling NUMERIC,
  ADD COLUMN IF NOT EXISTS estoque_bling INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS imagens_bling TEXT[],
  ADD COLUMN IF NOT EXISTS descricao_bling TEXT,
  ADD COLUMN IF NOT EXISTS situacao_bling TEXT,
  ADD COLUMN IF NOT EXISTS vendas_realizadas INTEGER DEFAULT 0;

-- Garantir que bling_id seja tratado como TEXT para manter compatibilidade com o formato vindo da API
-- (A tabela atual já tem bling_id como TEXT)

-- Inserir novas configurações globais se não existirem
INSERT INTO configuracoes_loja (chave, valor) VALUES 
('nome_loja', 'KdoisK'),
('whatsapp_suporte', ''),
('email_contato', ''),
('instagram_url', ''),
('facebook_url', ''),
('tiktok_url', '')
ON CONFLICT (chave) DO NOTHING;

-- Atualizar políticas de RLS para incluir permissão de atualização total para administradores (caso já tenha o RLS ativo)
-- Isso garante que as novas colunas possam ser lidas/escritas
-- (Nenhuma ação estrita é necessária se a política for USING (true) para authenticated)
