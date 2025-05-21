# Documentação do Projeto: Gerenciador de Tarefas

## Introdução

Este projeto consiste na criação de uma aplicação web completa, seguindo o padrão de arquitetura MVC. O objetivo principal é desenvolver um sistema de gerenciamento de tarefas robusto e flexível, permitindo aos usuários criar, organizar, categorizar, priorizar e acompanhar suas atividades diárias, incluindo a capacidade de dividi-las em subtarefas.

## Estrutura de Pastas e Arquivos Principais

```
Projeto-Individual-Inteli-M2/
│
├── assets/                
│   └── bancoRelacional.png
├── documentos/           
│   └── wad.md
├── node_modules/                
│   └── ...
├── public/
│   ├── css/
│   └── js/
├── src/                
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── categoriaController.js
│   │   ├── exampleController.js
│   │   ├── subTarefaController.js
│   │   ├── tarefaController.js
│   │   └── usuarioController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── categoriaModel.js
│   │   ├── exampleModel.js
│   │   ├── subTarefaModel.js
│   │   ├── tarefaModel.js
│   │   └── usuarioModel.js
│   ├── routes/
│   │   ├── categoriaRoutes.js
│   │   ├── exampleRoutes.js
│   │   ├── frontRoutes.js
│   │   ├── subTarefaRoutes.js
│   │   ├── tarefaRoutes.js
│   │   └── usuarioRoutes.js
│   ├── scripts/
│   │   ├── init.sql
│   │   └── runSQLScript.js
│   ├── views/
│   │   ├── categorias/
│   │   │   ├── create.ejs
│   │   │   ├── edit.ejs
│   │   │   └── index.ejs
│   │   ├── error.ejs
│   │   ├── home.ejs
│   │   ├── tarefas/
│   │   │   ├── create.ejs
│   │   │   ├── edit.ejs
│   │   │   ├── index.ejs
│   │   │   └── show.ejs
│   │   └── usuarios/
│   │       ├── editar.ejs
│   │       ├── index.ejs
│   │       ├── login.ejs
│   │       ├── perfil.ejs
│   │       └── registro.ejs
├── .env            
├── .env.example               
├── .gitignore              
├── package-lock.json
├── package.json               
├── README.md
└── server.js                      
```

## Modelo do Banco de Dados

-   **Usuarios**: Tabela de usuários (`usuarios`). Campos como `nome_usuario`, `email`, `senha_hash`, `criado_em`.
-   **Tarefas**: Tabela de tarefas (`tarefas`) com campos como `usuario_id`, `titulo`, `descricao`, `status`, `prioridade`, `data_vencimento`, `criado_em`, `atualizado_em`.
-   **Categorias**: Tabela para categorizar tarefas (`categorias`). Campos como `nome`, `usuario_id`, `criado_em`. Um usuário pode ter suas próprias categorias.
-   **Tarefas_Categorias**: Tabela de junção para o relacionamento muitos-para-muitos entre tarefas e categorias (`tarefas_categorias`). Campos: `tarefa_id`, `categoria_id`.
-   **Sub_Tarefas**: Tabela para subtarefas (`sub_tarefas`), vinculadas a uma tarefa principal. Campos como `tarefa_pai_id`, `titulo`, `status`, `criado_em`, `atualizado_em`.

## Como Executar o Projeto Localmente

1.  **Clone do projeto**:
    -   Clone o repositório do projeto com: 
    ```bash 
    git clone https://github.com/Reimar-Coelho/Projeto-Individual-Inteli-M2.git
    ```

2.  **Pré-requisitos**:
    -   Node.js e npm instalados.
    -   PostgreSQL instalado e em execução.

3.  **Configuração do Banco de Dados**:
    -   Copie e cole o arquivo `.env.example` e renomeie ele para `.env`, caso necessário, insira suas próprias configurações de banco de dados (DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT)

4.  **Instalação das Dependências**:
    ```bash
    cd Projeto-Individual-Inteli-M2
    npm install
    ```

5.  **Execução da Aplicação**:
    ```bash
    npm run init-db
    npm run init-app
    ```
    O servidor estará rodando em `http://localhost:5500`.

