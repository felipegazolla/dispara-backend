🚀 API de Automação com WhatsApp
API para envio de mensagens no WhatsApp, gerenciamento de campanhas, contatos, relatórios e sessões de usuários. Criada com Node.js, SQLite e whatsapp-web.js. 🌟

📋 Descrição
Esta API permite gerenciar contatos, criar campanhas e enviar mensagens automáticas pelo WhatsApp. Ela é segura, escalável e suporta múltiplas sessões de usuários. 🚀

📂 Estrutura do Projeto

src/
configs/                  # Configurações gerais
controllers/              # Lógica dos recursos da API
database/                 # Banco de dados e migrações
middlewares/              # Validações e manipulação de dados
routes/                   # Definição das rotas
utils/                    # Funções utilitárias
whatsapp/                 # Integração com WhatsApp
server.js                 # Inicialização do servidor

🛠️ Tecnologias Utilizadas

Node.js
Express
SQLite
whatsapp-web.js
JWT (JSON Web Token)
Knex.js
Puppeteer

🛳️ Começando

Pré-requisitos
Node.js (v20.x ou superior)
NPM (v8.x ou superior)
Chromium ou Google Chrome instalado
Passos para rodar localmente
Clone o repositório:

git clone <URL_DO_REPOSITORIO>
cd api

Instale as dependências:

npm install

Configure o banco de dados e autenticação:

Edite os arquivos necessários em src/configs/.

Execute as migrações do banco de dados:

npm run migrate

Inicie o servidor:

npm run dev

Acesse a API em: http://localhost:3333

📜 Documentação da API

1. Autenticação
POST /sessions
Cria uma sessão de login.

Body:

{
  "email": "usuario@example.com",
  "password": "senha123"
}

Respostas:

✅ 200 OK: Token JWT retornado.
❌ 401 Unauthorized: Credenciais inválidas.

2. WhatsApp
   
GET /whatsapp/auth
Gera um QR Code para autenticação.

Respostas:

✅ 200 OK: QR Code para autenticação.
❌ 500 Internal Server Error: Falha na geração do QR Code.

GET /whatsapp/status
Verifica o status da sessão do WhatsApp.

Respostas:

✅ 200 OK: Sessão autenticada.
❌ 401 Unauthorized: Sessão não autenticada.

3. Campanhas
POST /campaigns
Cria uma nova campanha.

Body:

{
  "name": "Minha Campanha",
  "description": "Descrição da campanha",
  "contact_ids": [1, 2, 3]
}

Respostas:

✅ 201 Created: Campanha criada.
❌ 400 Bad Request: Dados inválidos.

GET /campaigns

Lista todas as campanhas do usuário autenticado.

Respostas:

✅ 200 OK: Lista de campanhas.

4. Contatos
   
POST /contacts

Adiciona um novo contato.

Body:

{
  "name": "Contato Exemplo",
  "whatsapp_number": "559999999999"
}

Respostas:

✅ 201 Created: Contato criado.
❌ 400 Bad Request: Dados inválidos.

5. Mensagens
   
POST /messages/send

Envia uma mensagem para um número do WhatsApp.

Body:

{
  "number": "559999999999",
  "message": "Olá, esta é uma mensagem de teste!",
  "campaign_id": 1
}

Respostas:

✅ 201 Created: Mensagem enviada.
❌ 400 Bad Request: Dados inválidos.

6. Relatórios

GET /reports

Lista relatórios de envio de mensagens por campanha.

Respostas:

✅ 200 OK: Lista de relatórios.

🛡️ Segurança

JWT: Todas as rotas protegidas utilizam autenticação baseada em token.
Middleware ensureAuthenticated: Garante que o usuário esteja autenticado antes de acessar os endpoints.

📂 Banco de Dados

Tabelas principais:

Users: Gerenciamento de usuários.

Contacts: Lista de contatos.

Campaigns: Detalhes das campanhas.

Messages: Histórico de mensagens enviadas.

Reports: Relatórios de envio de mensagens.

🔧 Scripts Disponíveis

Comando	Descrição

npm start	Inicia o servidor em produção.

npm run dev	Inicia o servidor com nodemon (modo de desenvolvimento).

npm run migrate	Executa as migrações do banco de dados.

🛠️ Funcionalidades Adicionais

✅ Formatação de números de telefone

Os números de telefone são automaticamente formatados utilizando o middleware formatNumber.

👨‍💻 Autor
Projeto desenvolvido por Felipe Gazolla.
Entre em contato:

📧 enggazolla@gmail.com
💼 LinkedIn
⭐️ Dê uma estrela no repositório se você gostou do projeto! 🌟
