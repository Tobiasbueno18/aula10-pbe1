# Gestão de Resíduos

## Diagrama de Classes

O diagrama apresenta as classes principais do sistema e o relacionamento entre usuários e ocorrências.

![Diagrama de Classes](docs/diagrama_classes.png)

## Tecnologias

- Node.js
- Express
- JavaScript
- MySQL
- mysql2
- Insomnia
- XAMPP
- Visual Studio Code

## Passo a passo para testar

1. Instalar o Node.js.
2. Abrir o projeto no Visual Studio Code.
3. Abrir o terminal na pasta do projeto.
4. Instalar as dependências:

   `npm install`

5. Abrir o XAMPP e iniciar o MySQL.
6. Acessar o phpMyAdmin.
7. Executar o arquivo `db/script.sql` para criar o banco de dados e as tabelas.
8. Iniciar o servidor:

   `npm start`

9. Acessar o endereço:

   `http://localhost:3000`

10. Abrir o Insomnia e realizar os testes das rotas da API.



## Prints dos testes

### 1. Listagem de usuários
![GET Usuários](docs/get-usuarios.png)

### 2. Busca de usuário por ID
![GET Usuário por ID](docs/get-usuario-id.png)

### 3. Cadastro de usuário
![POST Usuários](docs/post-usuarios.png)

### 4. Atualização de usuário
![PUT Usuários](docs/put-usuarios.png)

### 5. Exclusão de usuário
![DELETE Usuários](docs/delete-usuarios.png)

### 6. Login
![POST Login](docs/post-login.png)

### 7. Listagem de ocorrências
![GET Ocorrências](docs/get-ocorrencias.png)

### 8. Busca de ocorrência por ID
![GET Ocorrência por ID](docs/get-ocorrencia-id.png)

### 9. Cadastro de ocorrência
![POST Ocorrências](docs/post-ocorrencias.png)

### 10. Atualização de ocorrência
![PUT Ocorrências](docs/put-ocorrencias.png)

### 11. Exclusão de ocorrência
![DELETE Ocorrências](docs/delete-ocorrencias.png)

### 12. Resumo das ocorrências
![GET Resumo](docs/get-resumo.png)