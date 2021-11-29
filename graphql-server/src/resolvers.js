const resolvers = {
  Query: {
    // getters de Clientes
    async cliente(root, { cpf }, { models }) {
      try {
        return await models.Clientes.findOne({
          where: {
            cpf,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    async todosClientes(root, args, { models }) {
      try {
        return await models.Clientes.findAll();
      } catch (err) {
        console.log(err);
      }
    },

    // getters de Produtos
    async produto(root, { id }, { models }) {
      return models.Produtos.findByPk(id);
    },

    async todosProdutos(root, args, { models }) {
      try {
        return await models.Produtos.findAll();
      } catch (err) {
        console.log(err);
      }
    },

    // getters de Pedidos
    async pedido(root, { id }, { models }) {
      return models.Pedidos.findByPk(id);
    },
  },

  Mutation: {
    // Métodos de Clientes
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
            cpf,
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
              cpf,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    // Métodos de Produtos
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

    async removerProduto(root, { id }, { models }) {
      try {
        return await models.Produtos.destroy({
          where: {
            id,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },

    async atualizarProduto(
      root,
      { id, nome, imagem, descricao, peso, preco, qnte },
      { models }
    ) {
      try {
        return models.Produtos.update(
          {
            nome,
            imagem,
            descricao,
            peso,
            preco,
            qnte,
          },
          {
            where: {
              id,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    // Métodos de Pedidos
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
};

module.exports = resolvers;
