📝 Sobre o Projeto
O projeto foi desenvolvido para atender aos seguintes requisitos:

Manipulação de Dados: O sistema realiza operações CRUD (Create, Read, Update, Delete) em um banco de dados relacional.

Modelo de Dados: Possui 6 tabelas com chaves primárias e estrangeiras, seguindo um esquema de gerenciamento de apostas.

Interface: A aplicação é operada via linha de comando (CLI), focando na lógica de negócios e na interação com o banco de dados.

⚙️ Pré-requisitos
Para rodar este projeto, você precisa ter o seguinte instalado em sua máquina:

Node.js: Versão 18.x ou superior.

npm (gerenciador de pacotes do Node.js): Vem com a instalação do Node.js.

PostgreSQL: Servidor de banco de dados relacional.

🚀 Instalação e Configuração
Siga os passos abaixo para configurar e rodar a aplicação em sua máquina.

Passo 1: Clone o Repositório
Baixe o código-fonte do projeto para sua máquina.

Bash

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
Passo 2: Instale as Dependências
Instale as bibliotecas necessárias para o projeto.

Bash

npm install
Passo 3: Configure o Banco de Dados
Você precisa ter uma instância do PostgreSQL rodando em sua máquina. Se precisar de ajuda para instalar, siga o guia de instalação oficial do PostgreSQL.

Crie um novo banco de dados. Você pode usar uma ferramenta como o pgAdmin ou o cliente de linha de comando psql.

SQL

CREATE DATABASE aposta_esportiva;
Crie as tabelas executando o script SQL abaixo no seu novo banco de dados. É crucial que as tabelas sejam criadas na ordem correta devido às chaves estrangeiras.

SQL

-- Copie e cole o script completo para criação das tabelas

CREATE TABLE users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES users(id),
  last_access_in TIMESTAMP NOT NULL
);

CREATE TABLE gamblers (
  id UUID PRIMARY KEY REFERENCES users(id),
  balance DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  registration_date TIMESTAMP NOT NULL
);

CREATE TYPE event_status AS ENUM('pending', 'in_progress', 'completed', 'cancelled');
CREATE TABLE events (
  id UUID PRIMARY KEY,
  sport VARCHAR(255) NOT NULL,
  description TEXT,
  expected_result VARCHAR(255) NOT NULL,
  status event_status,
  result VARCHAR(255),
  stated_on TIMESTAMP NOT NULL,
  finished_on TIMESTAMP,
  admin_id UUID NOT NULL REFERENCES admins(id)
);

CREATE TYPE bet_status AS ENUM('pending', 'won', 'lost');
CREATE TABLE bets (
  id UUID PRIMARY KEY,
  expected_result VARCHAR(255) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  odd DOUBLE PRECISION NOT NULL,
  possible_return DOUBLE PRECISION NOT NULL,
  status bet_status DEFAULT 'pending',
  bet_at TIMESTAMP NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id),
  gambler_id UUID NOT NULL REFERENCES gamblers(id)
);

CREATE TYPE transaction_type AS ENUM('deposit', 'withdrawal', 'bet');
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  type transaction_type NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  carried_out_in TIMESTAMP,
  gambler_id UUID NOT NULL REFERENCES gamblers(id)
);
Crie um arquivo na raiz do projeto chamado .env e adicione suas credenciais de conexão com o banco de dados.

Snippet de código

DB_USER=seu_usuario_do_postgres
DB_HOST=localhost
DB_NAME=aposta_esportiva
DB_PASSWORD=sua_senha_do_postgres
DB_PORT=5432
Passo 4: Rode a Aplicação
Com o banco de dados configurado e as dependências instaladas, você pode iniciar a aplicação CLI.

Bash

node cli.js
Após executar o comando, o menu da aplicação será exibido no terminal, e você poderá interagir com o sistema para criar, ler, atualizar e deletar dados no banco.

🤝 Contribuindo
Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma sugestão de melhoria, por favor, abra uma issue ou envie um pull request.
