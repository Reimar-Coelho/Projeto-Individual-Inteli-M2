CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE, -- Categoria pode ser específica do usuário
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, nome) -- Um usuário não pode ter duas categorias com o mesmo nome
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida', 'cancelada')),
    prioridade VARCHAR(50) DEFAULT 'Media' CHECK (prioridade IN ('Baixa', 'Media', 'Alta', 'Urgente')),
    data_vencimento DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas_categorias (
    tarefa_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (tarefa_id, categoria_id)
);

CREATE TABLE sub_tarefas (
    id SERIAL PRIMARY KEY,
    tarefa_pai_id INTEGER REFERENCES tarefas(id) ON DELETE CASCADE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar consultas comuns
CREATE INDEX idx_tarefas_usuario_id ON tarefas(usuario_id);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_prioridade ON tarefas(prioridade);
CREATE INDEX idx_tarefas_data_vencimento ON tarefas(data_vencimento);
CREATE INDEX idx_categorias_usuario_id ON categorias(usuario_id);
CREATE INDEX idx_sub_tarefas_tarefa_pai_id ON sub_tarefas(tarefa_pai_id);

-- Função para atualizar o campo atualizado_em automaticamente
CREATE OR REPLACE FUNCTION atualizar_coluna_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
   NEW.atualizado_em = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar atualizado_em nas tabelas tarefas e sub_tarefas
CREATE TRIGGER trigger_atualizar_tarefas_atualizado_em
BEFORE UPDATE ON tarefas
FOR EACH ROW
EXECUTE FUNCTION atualizar_coluna_atualizado_em();

CREATE TRIGGER trigger_atualizar_sub_tarefas_atualizado_em
BEFORE UPDATE ON sub_tarefas
FOR EACH ROW
EXECUTE FUNCTION atualizar_coluna_atualizado_em();

