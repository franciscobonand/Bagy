require("dotenv").config();
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  service: "yahoo",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: false,
  //   logger: true,
});

// formataData recebe um tipo Date e retorna dia/mes/ano
const formataData = (data) => {
  let dataStr = data.toISOString().split("T")[0];
  let [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
};

// formataEmail extrai o email, o assunto e monta o corpo do email
const formataEmail = async (
  { produtos, parcelas, clienteId, status },
  models
) => {
  const prodIds = produtos.split(";");
  let prodInfos = [];
  for (const prod of prodIds) {
    let prodAux = await models.Produtos.findByPk(prod);
    prodInfos.push(prodAux.dataValues);
  }

  const totalPedido = prodInfos
    .map((prod) => prod.preco)
    .reduce((curr, acc) => curr + acc);

  let cliente = await models.Clientes.findOne({
    where: {
      cpf: clienteId,
    },
  });
  cliente = cliente.dataValues;

  return {
    email: cliente.email,
    subject: `Novo pedido - ${formataData(cliente.createdAt)}`,
    html: `
    <p>
        <b>Cliente:</b> ${cliente.nome} <br>
        <b>Endereço de entrega:</b> <br>
        &emsp;<b>Rua:</b> ${cliente.rua} <br>
        &emsp;<b>Bairro:</b> ${cliente.bairro} <br>
        &emsp;<b>Cidade:</b> ${cliente.cidade} <br>
        &emsp;<b>Estado:</b> ${cliente.estado} <br>
        &emsp;<b>Número:</b> ${cliente.numero} <br>
        <b>Status do pedido:</b> ${status} <br>
        <b>Número de parcelas:</b> ${parcelas} <br>
        <b>Produtos:</b><br>
        ${prodInfos
          .map((prod) => {
            return `
                     &emsp;<b>Nome:</b> ${prod.nome} <br>
                     &emsp;<b>Descrição:</b> ${prod.descricao} <br>
                     &emsp;<b>Peso:</b> ${prod.peso} <br>
                     &emsp;<b>Preço:</b> ${prod.preco} <br>
                     &emsp;<b>Quantidade:</b> ${prod.qnte} <br><br>
                `;
          })
          .join("")}
        <b>Total da compra:</b> ${totalPedido}
    </p>
    `,
  };
};

// enviaEmail envia o email para o endereço informado, com o assunto e texto informados
const enviaEmail = ({ email, subject, html }) => {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { enviaEmail, formataEmail };
