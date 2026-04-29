-- Execute isso no SQL Editor do Supabase

-- Tabela para gerenciar os tokens do Bling
CREATE TABLE bling_tokens (
    id SERIAL PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insere um registro inicial se a tabela estiver vazia (para facilitar updates futuros)
INSERT INTO bling_tokens (id, access_token, refresh_token) 
VALUES (1, 'inicial', 'inicial') ON CONFLICT DO NOTHING;

-- Configurações estendidas dos produtos
CREATE TABLE produtos_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bling_id TEXT UNIQUE NOT NULL,
    ativo BOOLEAN DEFAULT false,
    destaque BOOLEAN DEFAULT false,
    badge TEXT CHECK (badge IN ('Novo', 'Mais Vendido', 'Promoção') OR badge IS NULL),
    descricao_customizada TEXT,
    preco_promocional NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações gerais da loja
CREATE TABLE configuracoes_loja (
    id SERIAL PRIMARY KEY,
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais de configurações
INSERT INTO configuracoes_loja (chave, valor) VALUES 
('parcelas_max', '12'),
('parcelas_sem_juros', '3'),
('frete_gratis_acima', '299.00'),
('pix_desconto_percent', '5')
ON CONFLICT (chave) DO NOTHING;

-- Banners da Home
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    titulo TEXT,
    subtitulo TEXT,
    imagem_url TEXT NOT NULL,
    link TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cupons de desconto
CREATE TABLE cupons (
    id SERIAL PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    tipo TEXT CHECK (tipo IN ('percentual', 'fixo')),
    valor NUMERIC NOT NULL,
    valor_minimo_pedido NUMERIC DEFAULT 0,
    usos_maximos INTEGER,
    usos_atual INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    expira_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pedidos (Opcional por enquanto, para expansão futura)
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID, -- Se tiver autenticação de usuários compradores
    status TEXT DEFAULT 'pendente',
    total NUMERIC NOT NULL,
    dados_entrega JSONB,
    itens JSONB NOT NULL,
    pagamento_id TEXT,
    pagamento_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
