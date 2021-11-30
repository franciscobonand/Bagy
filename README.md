# GraphQL + Node + SQLite server

Neste projeto, foi desenvolvida uma API GraphQL com Node, utilizando o banco de dados SQLite, para armazenamento e gestão de Clientes, Produtos e Pedidos.

Antes de executar a aplicação, é necessária a criação do arquivo `.env` dentro da pasta `graphql-server`. Isso é necessário pois nesse arquivo devem estar armazenadas as informações de usuário e senha que serão utilizados como remetentes do email que é enviado a um Cliente quando um novo Pedido é registrado.

O arquivo `.env` deve conter as seguintes informações:

```sh
EMAIL_USER=<endereço de email>
EMAIL_PASSWORD=<senha>
```

**Os dados da conta de email utilizada durante o desenvolvimento foram encaminhados juntamente ao link deste repositório.**

Para a implementação da API GraphQL foram utilizadas as libs Sequelize e Apollo, e para o envio de emails foi utilizado Nodemailer.  
Optou-se pela utilização de um email do Yahoo devido a [algumas complicações que o GMail acarreta](https://nodemailer.com/usage/using-gmail/).

## Como executar

### Manualmente

Com o intuito de iniciar a aplicação em seu próprio computador, basta acessar a pasta `/graphql-server` e executar o comando `npm start` (ou `node src/index.js`):

```sh
cd graphql-server
npm start
```

Uma vez iniciada, pode-se acessá-la no endereço `localhost:4000`.

### Docker

Caso deseje iniciar a aplicação em um container Docker, primeiramente deve-se criar a imagem da aplicação. Para fazer isso você pode executar o arquivo `exec-socker.sh`, ou executar os seguintes comandos:

```sh
cd graphql-server
docker build . -t bagy-server:v0.0.1
```

Uma vez que a imagem esteja criada, o container na qual a aplicação será iniciada deve ser criado:

```docker
docker run -dp 4000:4000 bagy-server:v0.0.1
```

Com o comando acima, fazemos um port forwarding da porta `:4000` do container para a porta `:4000` de nosso computador. Logo, a aplicação pode ser acessada no mesmo endereço `localhost:4000`.

## Aplicação

A aplicação desenvolvida consiste em um CRUD básico para cada uma das estruturas citadas anteriormente. Abaixo serão listadas as estruturas e funções da API.  
É válido ressaltar que, apesar da criação pedidos com produtos ou clientes inexistentes ou um produto ter quantidade negativa serem operações inválidas e que são tratadas pela API, existem outros pontos os quais ainda são passíveis de erro (como a validação do CPF e EMail).

## Estruturas

### Clientes

```js
  type Clientes {
    id: Int!
    nome: String!
    email: String!
    cpf: String!
    nascimento: String!
    rua: String!
    bairro: String!
    cidade: String!
    estado: String!
    pais: String!
    cep: String!
    numero: String!
  }
```

Optou-se por utilizar todos os campos acima como strings devido à sua extensão (CPF e CEP) e possibilidade de não ser apenas um número (Número - "49A"). Como já dito anteriormente, os valores passados nesses campos possuem apenas validação de tipo, e não da sua estrutura (por exemplo, `email` e `cpf` não são validados com um regex).  
Além disso, poderá ser observado adiante que, ao invés de `id`, optou-se por utilizar o `cpf` como chave única de Clientes.

### Produtos

```js
  type Produtos {
    id: Int!
    nome: String!
    imagem: String!
    descricao: String!
    peso: Float!
    preco: Float!
    qnte: Int!
  }
```

O campo `imagem` foi definido como do tipo string com o intuito de receber uma URL referente àquela imagem. Além disso, os campos `peso`, `preco` e `qnte` foram definidos como não-negativos, portanto se algum valor abaixo de 0 for passado, será substituído por uma quantidade positiva mínima pré-definida.

### Pedidos

```js
  type Pedidos {
    id: Int!
    produtos: String!
    parcelas: Int!
    clienteId: String!
    status: String!
  }
```

Como o banco de dados SQLite não possui um tipo array, o campo `produtos` é uma string que contém os identificadores dos produtos do pedido separados por ponto e vírgula (ex: "1;2;3;4"). Além disso, o campo `clienteId` refere-se ao CPF do cliente.

## Funções

### Query

```js
    cliente(cpf: String!): Clientes
    todosClientes: [Clientes!]!

    produto(id: Int!): Produtos
    todosProdutos: [Produtos!]!

    pedido(id: Int!): Pedidos
    todosPedidos: [Pedidos!]!
```

Os métodos acima são utilizados para obter valores das estruturas armazenadas no banco de dados. Os que recebem algum argumento retornam os valores de um objeto específico (um cliente, um produto ou um pedido), e os demais retornam todos os objetos de um tipo.

### Mutations

```js
    cadastrarCliente(...): String!

    removerCliente(cpf: String!): String!

    atualizarCliente(cpf: String!, ...): String!

    cadastrarProduto(...): String!

    removerProduto(id: Int!): String!

    atualizarProduto(id: Int!, ...): String!

    registrarPedido(produtos: [Int!]!, ...): String!

    removerPedido(id: Int!): String!

    atualizarPedido(id: Int!, ...): String!
```

Como pode ser percebido, todos os métodos retornam uma string. Optou-se por essa implementação de forma a retornar mensagens de sucesso e erro claras para o usuário.

Os métodos de criação (`cadastrarCliente`, `cadastrarProduto` e `registrarPedido`) devem receber como argumentos todos os campos referentes àquela estrutura. A única função que possui um argumento com tipagem diferente da previamente citada na seção "Estruturas" é `registrarPedido`, na qual os produtos devem ser informados como um array de identificadores (inteiros).

Os métodos de atualização (`atualizarCliente`, `atualizarProduto` e `atualizarPedido`) possuem os mesmos argumentos do que os métodos de criação, todavia o único argumento obrigatório é o identificador da estrutura a ser atualizada (`cpf` ou `id`).
Os métodos de deleção (`removerCliente`, `removerProduto` e `removerPedido`) recebem apenas um argumento, o qual é obrigatório, que é o identificador da estrutura a ser removida do banco de dados.

Todos os métodos relacionados a pedidos visam manter o controle no estoque de produtos. Se um produto não existe, o pedido não é criado ou atualizado. Quando um pedido é criado as quantias de seus produtos é subtraída do estoque, e o mesmo vale para atualizações de pedidos (é verificado quais produtos entraram/saíram do pedido, e seus estoques são atualizados). Caso um pedido seja removido, os produtos nele listados tem seu estoque atualizado.

Além de todos os métodos citados acima, foram criados métodos auxiliares que executam funções como enviar email e validar existência de alguma das estruturas.

## Comentários

Essa foi uma primeira experiência com o desenvolvimento de uma API GraphQL e Node bastante interessante. Dito isso, ainda existem algumas configurações (principalmente do Sequelize) que ainda necessito estudar mais, e uma refatoração do código (como extrair as funções auxiliares em outro arquivo e separar a definição do schema de GraphQL por estruturas) é necessária.

Além disso, os volumes do container Docker não são montados, logo todas as alterações feitas no banco de dados enquanto a aplicação é executada não são persistidos para o arquivo na máquina local. Por fim, ainda só é possível adicionar produtos de 1 em 1 nos pedidos, seria ideal para o usuário poder adicionar X produtos de um tipo de uma única vez.

## Exemplos

Abaixo são listados exemplos de query e mutations que são suportados pela aplicação.

### Cliente

```js
mutation($nome: String!, $email: String!, $cpf: String!, $nascimento: String!, $rua: String!, $bairro: String!, $cidade: String!, $estado: String!, $pais: String!, $cep: String!, $numero: String!) {
  cadastrarCliente(nome: $nome, email: $email, cpf: $cpf, nascimento: $nascimento, rua: $rua, bairro: $bairro, cidade: $cidade, estado: $estado, pais: $pais, cep: $cep, numero: $numero)
}

// Variables
{
  "nome": "Renato Blastoise",
  "email": "renatao@somemail.com",
  "cpf": "123.456.789-10",
  "nascimento": "11/12/1995",
  "rua": "Rua Agnaldo Pires",
  "bairro": "Bairo Plano A",
  "cidade": "Campinas",
  "estado": "São Paulo",
  "pais": "Brasil",
  "cep": "77777-777",
  "numero": "45a"
}
```

```js
query($clienteId: String!) {
  cliente(cpf: $clienteId) {
    id
    nome
    email
    cpf
    nascimento
    rua
    bairro
    cidade
    estado
    pais
    cep
    numero
  }
}

//Variables
{
  "clienteId": "123.456.789-10"
}
```

```js
query {
  todosClientes {
    id
    nome
    email
    cpf
    nascimento
    rua
    bairro
    cidade
    estado
    pais
    cep
    numero
  }
}
```

```js
mutation($cpf: String!) {
  removerCliente(cpf: $cpf)
}

// Variables
{
  "cpf": "123.123.123-18"
}
```

```js
mutation {
  atualizarCliente(
    email: "someemail2@somemail.com",
    cpf: "123.123.123-12",
  )
}
```

### Produto

```js
mutation($nome: String!, $imagem: String!, $descricao: String!, $peso: Float!, $preco: Float!, $qnte: Int!) {
  cadastrarProduto(nome: $nome, imagem: $imagem, descricao: $descricao, peso: $peso, preco: $preco, qnte: $qnte)
}

// Variables
{
  "nome": "Podcast",
  "imagem": "logoBonitinha.png",
  "descricao": "Podcast número 984894897985498 do mundo",
  "peso": 52.4,
  "preco": 999.99,
  "qnte": 10000
}
```

```js
query {
  todosProdutos {
    id
    nome
    imagem
    descricao
    peso
    preco
    qnte
  }
}
```

```js
mutation($removerProdutoId: Int!) {
  removerProduto(id: $removerProdutoId)
}

// Variables
{
  "removerProdutoId": 4
}
```

```js
mutation($atualizarProdutoId: Int!, $qnte: Int!) {
  atualizarProduto(id: $atualizarProdutoId, qnte: $qnte)
}

// Variables
{
  "atualizarProdutoId": 5,
  "qnte": 50
}
```

```js
query($produtoId: Int!){
  produto(id: $produtoId) {
    id
    nome
    imagem
    descricao
    peso
    preco
    qnte
  }
}

// Variables
{
  "produtoId": 5
}
```

### Pedido

```js
query{
  todosPedidos {
    id
    produtos
    parcelas
    clienteId
    status
  }
}
```

```js
mutation($removerPedidoId: Int!) {
  removerPedido(id: $removerPedidoId)
}

// Variables
{
  "removerPedidoId": 3
}
```

```js
mutation($produtos: [Int!]!, $parcelas: Int!, $clienteId: String!, $status: String!) {
  registrarPedido(produtos: $produtos, parcelas: $parcelas, clienteId: $clienteId, status: $status)
}

// Variables
{
  "produtos": [2,3,5],
  "parcelas": 130,
  "clienteId": "123.456.789-10",
  "status": "Um novo pedido saindo do forno"
}
```

```js
mutation($atualizarPedidoId: Int!, $produtos: [Int!], $status: String) {
  atualizarPedido(id: $atualizarPedidoId, produtos: $produtos, status: $status)
}

// Variables
{
  "atualizarPedidoId": 3,
  "produtos": [],
  "status": "Um pedido diferenciado"
}
```
