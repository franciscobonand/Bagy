const { gql } = require("apollo-server");

const typeDefs = gql`
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
    pedidos: [Pedidos!]!
  }

  type Produtos {
    id: Int!
    nome: String!
    imagem: String!
    descricao: String!
    peso: Float!
    preco: Float!
    qnte: Int!
  }

  type Pedidos {
    id: Int!
    produtos: String!
    parcelas: String!
    clienteId: String!
    status: String!
  }

  type Query {
    cliente(cpf: String!): Clientes
    todosClientes: [Clientes!]!

    produto(id: Int!): Produtos
    todosProdutos: [Produtos!]!

    pedido(id: Int!): Pedidos
    todosPedidos: [Pedidos!]!
  }

  type Mutation {
    cadastrarCliente(
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
    ): Clientes!

    removerCliente(cpf: String!): Int!

    atualizarCliente(
      cpf: String!
      nome: String
      email: String
      nascimento: String
      rua: String
      bairro: String
      cidade: String
      estado: String
      pais: String
      cep: String
      numero: String
    ): [Int!]!

    cadastrarProduto(
      nome: String!
      imagem: String!
      descricao: String!
      peso: Float!
      preco: Float!
      qnte: Int!
    ): Produtos!

    removerProduto(id: Int!): Int!

    atualizarProduto(
      id: Int!
      nome: String
      imagem: String
      descricao: String
      peso: Float
      preco: Float
      qnte: Int
    ): [Int!]!

    registrarPedido(
      produtos: [Int!]!
      parcelas: Int!
      clienteId: String!
      status: String!
    ): String!

    removerPedido(id: Int!): String!

    atualizarPedido(
      id: Int!
      produtos: [Int!]
      parcelas: Int
      clienteId: String
      status: String
    ): String!
  }
`;

module.exports = typeDefs;
