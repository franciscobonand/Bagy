const resolvers = {
  Query: {
    async cliente(root, { cpf }, { models }) {
      return await models.Clientes.findOne({
        where: {
          cpf: cpf,
        },
      });
    },

    async todosClientes(root, args, { models }) {
      return await models.Clientes.findAll();
    },

    async produto(root, { id }, { models }) {
      return models.Produtos.findByPk(id);
    },

    async pedido(root, { id }, { models }) {
      return models.Pedidos.findByPk(id);
    },
  },

  Mutation: {
    async cadastrarCliente(
      root,
      {
        nome,
        email,
        cpf,
        nascimento,
        rua,
        bairro,
        cidade,
        estado,
        pais,
        cep,
        numero,
      },
      { models }
    ) {
      try {
        return await models.Clientes.create({
          nome,
          email,
          cpf,
          nascimento,
          rua,
          bairro,
          cidade,
          estado,
          pais,
          cep,
          numero,
        });
      } catch (err) {
        console.log(err);
      }
    },

    async removerCliente(root, { cpf }, { models }) {
      try {
        return await models.Clientes.destroy({
          where: {
            cpf: cpf,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    async atualizarCliente(
      root,
      {
        cpf,
        nome,
        email,
        nascimento,
        rua,
        bairro,
        cidade,
        estado,
        pais,
        cep,
        numero,
      },
      { models }
    ) {
      try {
        return await models.Clientes.update(
          {
            nome,
            email,
            nascimento,
            rua,
            bairro,
            cidade,
            estado,
            pais,
            cep,
            numero,
          },
          {
            where: {
              cpf: cpf,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    async cadastrarProduto(
      root,
      { nome, imagem, descricao, peso, preco, qnte },
      { models }
    ) {
      return models.Produtos.create({
        nome,
        imagem,
        descricao,
        peso,
        preco,
        qnte,
      });
    },

    async registrarPedido(
      root,
      { produtos, parcelas, clienteId, status },
      { models }
    ) {
      try {
        const prodStr = produtos.join(";");
        const pedido = await models.Pedidos.create({
          produtos: prodStr,
          parcelas,
          clienteId,
          status,
        });
        return pedido;
      } catch (err) {
        console.log(err);
      }
    },
  },

  //   Clientes: {
  //     async pedidos(cliente) {
  //       return cliente.getPedidos();
  //     },
  //   },

  //   Pedidos: {
  //     async cliente(pedido) {
  //       return pedido.getCliente();
  //     },
  //   },
};

module.exports = resolvers;
