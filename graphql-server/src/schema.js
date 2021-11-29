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
    pedido(id: Int!): Pedidos
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

    registrarPedido(
      produtos: [Int!]!
      parcelas: Int!
      clienteId: String!
      status: String!
    ): Pedidos!
  }
`;

module.exports = typeDefs;
