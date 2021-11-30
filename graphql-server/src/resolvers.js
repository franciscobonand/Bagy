const { enviaEmail, formataEmail } = require("./email");

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
      try {
        return await models.Produtos.findByPk(id);
      } catch (err) {
        console.log(err);
      }
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
      try {
        return await models.Pedidos.findByPk(id);
      } catch (err) {
        console.log(err);
      }
    },

    async todosPedidos(root, args, { models }) {
      try {
        return await models.Pedidos.findAll();
      } catch (err) {
        console.log(err);
      }
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
        if (await clienteCadastrado(cpf, models))
          return `Cliente ${cpf} já cadastrado`;

        const resp = await models.Clientes.create({
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
        if (objetoNaoVazio(resp)) {
          return "Cliente cadastrado com sucesso";
        }
        return "Não foi possível cadastrar o cliente";
      } catch (err) {
        console.log(err);
        return `Erro ao cadastrar cliente: ${err}`;
      }
    },

    async removerCliente(root, { cpf }, { models }) {
      try {
        if (!(await clienteCadastrado(cpf, models)))
          return `Cliente ${cpf} não cadastrado`;

        const resp = await models.Clientes.destroy({
          where: {
            cpf,
          },
        });

        if (resp) return `Cliente '${cpf}' removido com sucesso`;
        return `Não foi possível remover o cliente '${cpf}'`;
      } catch (err) {
        console.log(err);
        return `Erro ao remover produto: ${err}`;
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
        if (!(await clienteCadastrado(cpf, models)))
          return `Cliente ${cpf} não cadastrado`;

        const resp = await models.Clientes.update(
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
        if (resp) return `Atualização do cliente '${cpf}' concluída`;
        return `Não foi possível atualizar o cliente '${cpf}'`;
      } catch (err) {
        console.log(err);
        return `Erro ao remover cliente: ${err}`;
      }
    },

    // Métodos de Produtos
    async cadastrarProduto(
      root,
      { nome, imagem, descricao, peso, preco, qnte },
      { models }
    ) {
      try {
        const resp = await models.Produtos.create({
          nome,
          imagem,
          descricao,
          peso: peso < 0 ? 0.1 : peso,
          preco: preco < 0 ? 1 : preco,
          qnte: qnte < 0 ? 0 : qnte,
        });

        if (objetoNaoVazio(resp)) {
          return "Produto cadastrado com sucesso";
        }
        return "Não foi possível cadastrar o produto";
      } catch (err) {
        console.log(err);
        return `Erro ao cadastrar produto: ${err}`;
      }
    },

    async removerProduto(root, { id }, { models }) {
      try {
        const resp = await models.Produtos.destroy({
          where: {
            id,
          },
        });

        if (resp) return `Produto '${id}' removido com sucesso`;
        return `Não foi possível remover o produto '${id}'`;
      } catch (err) {
        console.log(err);
        return `Erro ao remover produto: ${err}`;
      }
    },

    async atualizarProduto(
      root,
      { id, nome, imagem, descricao, peso, preco, qnte },
      { models }
    ) {
      try {
        const [resp] = await models.Produtos.update(
          {
            nome,
            imagem,
            descricao,
            peso: peso < 0 ? 0.1 : peso,
            preco: preco < 0 ? 1 : preco,
            qnte: qnte < 0 ? 0 : qnte,
          },
          {
            where: {
              id,
            },
          }
        );
        if (resp) return `Atualização do produto '${id}' concluída`;
        return `Não foi possível atualizar o produto '${id}'`;
      } catch (err) {
        console.log(err);
        return `Erro ao remover produto: ${err}`;
      }
    },

    // Métodos de Pedidos
    async registrarPedido(
      root,
      { produtos, parcelas, clienteId, status },
      { models }
    ) {
      try {
        if (!(await clienteCadastrado(clienteId, models)))
          return `Cliente ${clienteId} não cadastrado`;

        if (
          produtos?.length > 0 &&
          (await todosProdutosDisponiveis(produtos, models))
        ) {
          produtos.forEach((prod) => {
            atualizaEstoque(prod, -1, models);
          });

          const resp = await models.Pedidos.create({
            produtos: produtos.join(";"),
            parcelas,
            clienteId,
            status,
          });

          if (objetoNaoVazio(resp)) {
            enviaEmail(await formataEmail(resp.dataValues, models));
            return "Pedido criado com sucesso";
          }
        }

        return "Existem produtos indisponíveis ou inválidos no pedido";
      } catch (err) {
        console.log(err);
        return `Erro ao criar pedido: ${err}`;
      }
    },

    async removerPedido(root, { id }, { models }) {
      try {
        const infoPedido = await models.Pedidos.findByPk(id);
        if (infoPedido) {
          const produtos = infoPedido.dataValues.produtos.split(";");

          produtos.forEach((prod) => {
            atualizaEstoque(prod, 1, models);
          });

          const resp = await models.Pedidos.destroy({
            where: {
              id,
            },
          });

          if (resp) return `Pedido '${id}' removido com sucesso`;
          return `Não foi possível remover o pedido ${id}`;
        }

        return `Pedido com id '${id}' não encontrado`;
      } catch (err) {
        console.log(err);
        return `Erro ao remover pedido: ${err}`;
      }
    },

    async atualizarPedido(
      root,
      { id, produtos, parcelas, clienteId, status },
      { models }
    ) {
      try {
        if (!(await models.Pedidos.findByPk(id)))
          return `Pedido ${id} não existe`;

        if (clienteId && !(await clienteCadastrado(clienteId, models)))
          return `Cliente ${clienteId} não cadastrado`;

        if (produtos && produtos.length > 0) {
          if (!(await todosProdutosDisponiveis(produtos, models)))
            return "Existem produtos indisponíveis no pedido";

          const { retirados, adicionados } = await produtosAlterados(
            id,
            produtos,
            models
          );

          if (retirados.length > 0) {
            retirados.forEach((prod) => {
              atualizaEstoque(prod, 1, models);
            });
          }

          if (adicionados.length > 0) {
            adicionados.forEach((prod) => {
              atualizaEstoque(prod, -1, models);
            });
          }
        }

        const [resp] = await models.Pedidos.update(
          {
            produtos: produtos?.length > 0 ? produtos.join(";") : undefined,
            parcelas,
            clienteId,
            status,
          },
          {
            where: {
              id,
            },
          }
        );

        if (resp) return `Atualização do pedido '${id}' concluída`;
        return `Não foi possível atualizar o pedido '${id}'`;
      } catch (err) {
        console.log(err);
        return `Erro ao atualizar pedido: ${err}`;
      }
    },
  },
};

// atualizaEstoque atualiza quantidades dos produtos com base em um pedido
const atualizaEstoque = async (idProd, valor, models) => {
  try {
    const prod = await models.Produtos.findByPk(idProd);

    models.Produtos.update(
      {
        qnte: (prod.dataValues.qnte += valor),
      },
      {
        where: {
          id: idProd,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// produtosAlterados valida mudanças nos produtos de um pedido
const produtosAlterados = async (idPedido, novosProd, models) => {
  let alteracoes = { retirados: [], adicionados: [] };
  try {
    const pedido = await models.Pedidos.findByPk(idPedido);
    const antigosProd = pedido.dataValues.produtos.split(";");

    antigosProd.forEach((ap) => {
      if (novosProd.includes(ap)) {
        novosProd = novosProd.filter((elem) => elem !== ap);
      } else {
        alteracoes.retirados.push(ap);
      }
    });

    alteracoes.adicionados = novosProd ?? [];
    return alteracoes;
  } catch (err) {
    console.log(err);
    return {};
  }
};

// todosProdutosDisponiveis valida se todos os produtos de um pedido estão disponíveis
const todosProdutosDisponiveis = async (produtos, models) => {
  try {
    for (const prod of produtos) {
      const resp = await models.Produtos.findByPk(prod);
      if (!resp || resp.dataValues.qnte < 1) return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// objetoNaoVazio verifica se um objeto não é vazio
const objetoNaoVazio = (obj) => {
  return !(
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
};

// clienteCadastrado verifica se o cliente já foi cadastrado no db
const clienteCadastrado = async (cpf, models) => {
  const cliente = await models.Clientes.findOne({
    where: {
      cpf,
    },
  });

  return cliente ? true : false;
};

module.exports = resolvers;
