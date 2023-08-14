# User e Courses + Permissão de Administrador

# Introdução

A empresa que você trabalha precisa criar um MVP (Minimum Viable Product) de uma API que faz o controle de usuários e cursos em que esses usuários serão matriculados. Essa API também precisa ter um controle de acessos, onde alguns recursos podem ser acessados apenas por usuários que fizeram login na aplicação, e outros recursos apenas usuários que fizeram login e tem permissões de administrador podem acessar.

Você foi o desenvolvedor selecionado para implementar o MVP levando em conta o que está sendo requisitado a seguir.

# Regras da entrega

**A entrega deve seguir as seguintes regras:**

- O código deve estar em **_TypeScript_**, caso não esteja a entrega será zerada;
- Deverá ser utilizado um banco de dados **_postgres_** para a elaboração da API;
- O nome da tabela, das colunas e demais especificações, devem ser **_seguidas à risca_**. Caso tenha divergência, será descontado nota;
  - Tenha muita atenção sobre o nome das chaves nos objetos de entrada e saída de cada requisição;
- Na raiz do diretório deve-se conter uma pasta nomeada sql, com dois arquivos:
  - createTables.sql: contendo as queries de criação e inserção das tabelas;
  - diagram.png/jpg: um arquivo .png ou .jpg contendo o diagrama da tabela;
- caso o arquivo createTables.sql não exista, a entrega será zerada.

**Essa entrega possui testes automatizados, portanto:**

- É necessário executar um **npm install** assim que fizer o clone do repositório para que as depedências dos testes sejam instaladas.
- É necessário criar um banco de dados separado para a execução dos testes.
  - Faça a criação do banco de testes e coloque os dados de conexão dele nas variáveis de ambiente que contém o indicador **_TEST_** no nome, assim sua aplicação vai saber em qual banco deve se conectar no momento de executar os testes, evitando inconsistência nos dados.
- Para que os testes possam ser executados, existe um script de limpeza do banco que utiliza as queries do arquivo **createTables.sql** para ser executado, por isso é importante seguir as orientações sobre subdiretório sql e seus arquivos à risca.

  - Caso o subdiretório sql e o arquivo createTables.sql não estejam com os nomes corretos ou no caminho correto os testes falharão, pois não será possível encontrar as queries a serem executadas;
  - Caso o nome de alguma tabela, tipo ou coluna não esteja de acordo com o esperado, os testes também falharão.

- A organização dos demais arquivos e pastas deve seguir o que foi visto previamente.
- Todos os pacotes necessários para desenvolver a aplicação devem ser instalados, já que apenas os pacotes de teste foram incluídos no repositório.

#

## **Tabelas do banco de dados**

### **Tabela users**

- Nome da tabela: **_users_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **email**: string, tamanho 50, obrigatório e único.
  - **password**: string, tamanho 120 e obrigatório.
  - **admin**: booleano, obrigatório e **DEFAULT** igual a **false**.

### **Tabela courses**

- Nome da tabela: **_courses_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 15 e obrigatório.
  - **description**: texto e obrigatório.

### **Tabela userCourses**

- Nome da tabela: **_userCourses_**.
- Representa a tabela intermediária que fará a relação N:N entre **users** e **courses**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **active**: booleano, obrigatório e **DEFAULT** igual a **true**.
  - **userId**: inteiro, obrigatório e chave estrangeira.
  - **courseId**: inteiro, obrigatório e chave estrangeira.

#

## **Relacionamentos**

### **users e courses**

- Um usuário pode se matricular em vários cursos e um curso pode ter vários usuários matriculados a ele.
- Caso um **_course_** seja deletado, todas as relações com **_users_** devem ser **deletadas** automaticamente da tabela intermediária.
- Caso um **_user_** seja deletado, todas as relações com **_courses_** devem ser **deletadas** automaticamente da tabela intermediária.

#

## **Rotas - /users e /login**

## Endpoints

| Método | Endpoint           | Responsabilidade                              |
| ------ | ------------------ | --------------------------------------------- |
| POST   | /users             | Cadastrar um novo usuário                     |
| POST   | /login             | Criar o token de autenticação para um usuário |
| GET    | /users             | Listar todos os usuários                      |
| GET    | /users/:id/courses | Listar todos os cursos de um usuário          |

#

## Regras da aplicação

### **POST /users**

- Deve ser possível criar um usuário enviando o seguinte através do corpo da requisição;
  - **name**: string, campo obrigatório.
  - **email**: string, campo obrigatório.
  - **password**: string, campo obrigatório
  - **admin**: booleano, opcional.
- A password deve ser armazenada no banco em formato de hash.
- Não deve ser possível cadastrar um developer enviando um email já cadastrado no banco de dados.
- Deve ser feita a serialização de dados de entrada e saída usando o zod:

  - Todos os campos obrigatórios devem estar no body da requisição.
  - O email deve ser um email válido.
  - O campo de **password** NÃO deve ser retornado na resposta.

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados do usuário cadastrado, com excessão do hash da password.
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso o email já cadastrado no banco:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

  - Caso a validação do zod dê erro:
    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

- **Exemplos de retornos**:

- Criando um developer com sucesso:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  // Cadastrando com admin igual a true
  {
      "name": "Ugo",
      "email": "ugo@kenzie.com.br",
      "password": "1234",
      "admin": true
  }

  // Cadastrando com admin igual a false ou sem enviar o campo de admin
  {
      "name": "Ugo",
      "email": "ugo@kenzie.com.br",
      "password": "1234"
  }
  ```

  | Resposta do servidor:      |
  | -------------------------- |
  | Body: Formato Json         |
  | Status code: _201 CREATED_ |

  ```json
  //Retorno ao enviar o campo de admin igual a true
  {
      "id": 1,
      "name": "Ugo",
      "email": "ugo@kenzie.com.br",
      "admin": true
  }

  //Retoro ao enviar o campo de admin igual a false ou não enviar o campo de admin
  {
      "id": 1,
      "name": "Ugo",
      "email": "ugo@kenzie.com.br",
      "admin": false
  }
  ```

- Tentando cadastrar com um email existente:

  | Resposta do servidor:       |
  | --------------------------- |
  | Body: Formato Json          |
  | Status code: _409 CONFLICT_ |

  ```json
  {
    "message": "Email already registered"
  }
  ```

- Tentando cadastrar com um body inválido:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  // Cadastrando com admin igual a true
  {
    "email": "ugo",
    "password": 1234,
    "admin": true
  }
  ```

  | Resposta do servidor:          |
  | ------------------------------ |
  | Body: Formato Json             |
  | Status code: _400 BAD REQUEST_ |

  ```json
  {
    "name": ["Required"],
    "email": ["Invalid email"],
    "password": ["Expected string, received number"]
  }
  ```

#

### **POST /login**

- Deve ser possível criar um token jwt enviando o seguinte através do corpo da requisição:

  - **email**: string, campo obrigatório.
  - **password**: string, campo obrigatório

- Deve ser feita a serialização de dados de entrada usando o zod:

  - Todos os campos obrigatórios devem estar no body da requisição.

- **Sucesso**:
  - Retorno esperado: um objeto contendo o token jwt.
  - Status esperado: _20 OK_
- **Falha**:

  - Caso o email não exista ou a senha esteja incorreta:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso a validação do zod dê erro:
    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

- **Exemplos de retornos**:

- Tentando fazer login com email e senha corretos:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  {
    "email": "ugo@kenzie.com.br",
    "password": "1234"
  }
  ```

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ````json
  {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
      ```

  ````

- Tentando fazer login com email não existente ou senha incorreta:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Wrong email/password"
  }
  ```

- Tentando fazer login com um body inválido:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  {
    "email": "ugo",
    "password": 1234
  }
  ```

  | Resposta do servidor:          |
  | ------------------------------ |
  | Body: Formato Json             |
  | Status code: _400 BAD REQUEST_ |

  ```json
  {
    "email": ["Invalid email"],
    "password": ["Expected string, received number"]
  }
  ```

#

### **GET /users**

- Deve listar todos os usuários.
- O retorno da resposta não deve conter o hash da password.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os usuários;
  - Status esperado: _200 OK_;
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

- **Exemplos de retornos**:

- Listando usuários com sucesso:

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ```json
  [
    {
      "id": 1,
      "name": "Ugo",
      "email": "ugo@kenzie.com.br",
      "admin": true
    },
    {
      "id": 2,
      "name": "Lucas",
      "email": "lucas@kenzie.com.br",
      "admin": false
    }
  ]
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da biblioteca
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```

#

### **GET - /users/:id/courses**

- Deve ser possível listar todos os cursos de um usuário.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os cursos vinculados ao usuário logado, juntamente com os dados do usuário;
  - Status esperado: _200 OK_;
    - Use o _alias_ nas colunas do SELECT para retornar os campos de acordo com os nomes mostrados no JSON de exemplo.
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o usuário não esteja matriculado em nenhum curso:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _403 FORBIDDEN_.

- **Exemplos de retornos**:

- Listando cursos do usuário logado com sucesso:

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ```json
  [
    {
      "couseId": 1,
      "courseName": "Frontend",
      "courseDescription": "HTML, CSS e JavaScript",
      "userActiveInCourse": true,
      "userId": 1,
      "userName": "Ugo"
    },
    {
      "couseId": 2,
      "courseName": "React",
      "courseDescription": "Biblioteca React para construção de frontend",
      "userActiveInCourse": false,
      "userId": 1,
      "userName": "Ugo"
    }
  ]
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da bibliotecInsufficient permissiona
  }
  ```

- Caso o usuário não esteja matriculado em nenhum curso:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _404 NOT FOUND_ |

  ```json
  {
    "message": "No course found"
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```

#

## **Rota - /courses**

## Endpoints

| Método | Endpoint                         | Responsabilidade                                  |
| ------ | -------------------------------- | ------------------------------------------------- |
| POST   | /courses                         | Cadastrar um novo curso                           |
| GET    | /courses                         | Listar todos os cursos                            |
| POST   | /courses/:courseId/users/:userId | Matricular o usuário em um curso                  |
| DELETE | /courses/:courseId/users/:userId | Setar matrícula para false do usuário em um curso |
| GET    | /courses/:id/users               | Listar todos os usuários matriculados em um curso |

### **POST /courses**

- Deve ser possível criar um curso enviando o seguinte através do corpo da requisição:
  - **name**: string, campo obrigatório.
  - **description**: string, campo obrigatório.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.
- Deve ser feita a serialização de dados de entrada e saída usando o zod:

  - Todos os campos obrigatórios devem estar no body da requisição.

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados do curso cadastrado.
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso a validação do zod dê erro:

    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

- **Exemplos de retornos**:

- Criando um course com sucesso:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  {
    "name": "Frontend",
    "description": "HTML, CSS e JavaScript"
  }
  ```

  | Resposta do servidor:      |
  | -------------------------- |
  | Body: Formato Json         |
  | Status code: _201 CREATED_ |

  ```json
  {
    "id": 1,
    "name": "Frontend",
    "description": "HTML, CSS e JavaScript"
  }
  ```

- Tentando cadastrar com um body inválido:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  ```json
  {
    "description": 1234
  }
  ```

  | Resposta do servidor:          |
  | ------------------------------ |
  | Body: Formato Json             |
  | Status code: _400 BAD REQUEST_ |

  ```json
  {
    "name": ["Required"],
    "description": ["Expected string, received number"]
  }
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da biblioteca
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```

#

### **GET /courses**

- Deve listar todos os cursos.

- **Sucesso**:

  - Retorno esperado: um array contendo os objetos de todos os cursos;
  - Status esperado: _200 OK_;

- **Exemplos de retornos**:

- Listando usuários com sucesso:

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ```json
  [
    {
      "id": 1,
      "name": "Frontend",
      "description": "HTML, CSS e JavaScript"
    },
    {
      "id": 2,
      "name": "React",
      "description": "Frontend com a biblioteca React"
    }
  ]
  ```

#

### **POST /courses/:courseId/users/:userId**

- Deve ser possível matricular o usuário em um curso, enviando o id do curso e o id do user no parâmetro de rota:
  - Essa rota irá usar a tabela intermediária _userCourses_ para vincular o usuário ao curso que ele será matriculado.
  - O campo active deve ser colocado com **true**
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso o course ou o user não existam:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

- **Exemplos de retornos**:

- Criando um course com sucesso:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  | Resposta do servidor:      |
  | -------------------------- |
  | Body: Formato Json         |
  | Status code: _201 CREATED_ |

  ```json
  {
    "message": "User successfully vinculed to course"
  }
  ```

- Caso o course ou o user não existam:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _404 NOT FOUND_ |

  ```json
  {
    "message": "User/course not found"
  }
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da biblioteca
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```

#

### **DELETE /courses/:courseId/users/:userId**

- Deve ser possível inativar a matricula de um usuário em um curso, enviando o id do curso e o id do user no parâmetro de rota:
  - Essa rota irá atualizar o valor do campo **active** da tabela intermediária _userCourses_ para **false**.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: não deve retornar nenhum dado;
  - Status esperado: _204 NO BODY_
- **Falha**:

  - Caso o course ou o user não existam:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

- **Exemplos de retornos**:

- Criando um course com sucesso:

  | Dados de entrada:  |
  | ------------------ |
  | Body: Formato Json |

  | Resposta do servidor:      |
  | -------------------------- |
  | Body: Formato Json         |
  | Status code: _204 NO BODY_ |

  ```json

  ```

- Caso o course ou o user não existam:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _404 NOT FOUND_ |

  ```json
  {
    "message": "User/course not found"
  }
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da biblioteca
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```

#

### **GET - /courses/:id/users**

- Deve ser possível listar todos os usuários vinculados a um curso.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os usuários vinculados a um curso, juntamente com os dados do curso
  - Status esperado: _200 OK_;
    - Use o _alias_ nas colunas do SELECT para retornar os campos de acordo com os nomes mostrados no JSON de exemplo.
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

- **Exemplos de retornos**:

- Listando cursos do usuário logado com sucesso:

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ```json
  [
    {
      "userId": 1,
      "userName": "Ugo",
      "couseId": 1,
      "courseName": "Frontend",
      "courseDescription": "HTML, CSS e JavaScript",
      "userActiveInCourse": true
    },
    {
      "userId": 2,
      "userName": "Lucas",
      "couseId": 1,
      "courseName": "Frontend",
      "courseDescription": "HTML, CSS e JavaScript",
      "userActiveInCourse": true
    }
  ]
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

- Caso o token enviado seja inválido:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
      "message": // mensagem padrão da biblioteca
  }
  ```

- Caso o token pertença a um usuário cujo o **admin** seja false:

  | Resposta do servidor:        |
  | ---------------------------- |
  | Body: Formato Json           |
  | Status code: _403 FORBIDDEN_ |

  ```json
  {
    "message": "Insufficient permission"
  }
  ```
