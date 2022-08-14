//IMPORTANTE -> Após implementarmos o nosso middleware de autenticação no login(email e senha), precisamos proteger duas rotas importantes em nossa aplicação. São elas: adiciona post e deletar usuário. Como nós conseguimos garantir a autenticação do usuário, sem ter que ficar pedindo toda vez o email e a senha? Através de Tokens. O que iremos fazer agora é uma estratégia parecida com a estratégia "local", só que, ao invés de enviar email e senha, o cliente vai ter que enviar um token. Ele irá receber esse token, no momento em que ele se autentica com a estratégia local, e teremos que fazer com que ele guarde esse token de alguma forma, pra que ele possa enviar de volta nas próximas requisições. Vamos implementar a criação desse token e o envio dele para o usuário. Para fazer isso, vamos instalar o pacote jsonwebtoken com o npm.

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken') // Para utilizarmos os métodos do JWT, precisamos importa-lo.

function criaTokenJWT(usuario) { // Vamos começar criando uma função que irá criar o token(criaTokenJWT). Essa função irá receber o usuário como parametro.
  const payload = { //Para criarmos o nosso token, precisamos de 3 coisas: payload, cabeçalho e assinatura. Para darmos início, precisamos pegar o payload, que será informado assim que o usuário efetuar o login(id)
    id: usuario.id
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT); //Utilizando o método ".sign", iremos passar como parametros o nosso payload e uma "senha secreta" do nosso servidor. Essa é a função de criação do Token JWT. No entanto nossa senha é o que torna o nosso token seguro, sendo assim, devemos usar um gerador de números aletórios, que já vem instalado no node, que se chama "crypto", que irá criar uma senha forte o bastante para o nosso código. Comando para gerar senha: node -e "console.log(require('crypto').randomBytes(256).toString('base64'))". Ainda assim temos um outro porém: colocarmos a nossa senha direto no nosso código não é uma forma indicada, até porque, como utilizamos o Github, para controle de versão, e deixamos nosso código público, faz com que nosso código fique vulnerável do mesmo jeito. Sendo assim, podemos colocar nossa senha dentro de uma variável de ambiente, que além de não publicarmos a senha dentro de um gerenciador de versões, mas dentro da variável de ambiente ela será acessível por todos os pontos do nosso programa, simplesmente alterando a variável quando necessário(durante o desenvolvimento do programa, por exemplo). Pra isso, precisamos criar um novo arquivo no nosso projeto chamado ".env". Para ler nossa variável de ambiente, será necessário instalar um pacote chamado "dotenv". Após instalar, vamos chama-lo no nosso server.js. Depois disso, vamos alterar a nossa senha por um objeto process, que irá ler a variável de ambiente. Env será o elemento e CHAVE_JWT será a variável de ambiente.
  return token; //após criarmos o token, precisamos apenas retorna-lo.

}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: (req, res) => { // aqui criamos a nossa função de login. Como nesse caso, o cliente já está autenticado, o que o mesmo irá receber é somente a informação sobre o status e a pagina em branco.
    const token = criaTokenJWT(req.user); //Antes de enviarmos a nossa resposta, vamos criar o nosso token gerado, com a função criaTokenJWT, que vai receber o user da requisição, que é colocado no momento em que o passport Authentication é finalizado, somente a partir desse momento, o req passa a ter o atributo user com o nosso usuário.
    res.set('Authorization', token); //Agora, pra enviarmos esse token para o nosso usuário, vamos utilizar os cabeçalhos da nossa resposta, pra ser mais específico, iremos utilizar o cabeçalho "Authorization", que é utilizado pra isso. É possível enviar no corpo da resposta, mas não é o correto a se fazer. Para enviarmos, vamos utilizar o método ".set", que como primeiro parametro, irá pedir qual cabeçalho vc irá utilizar('Authorization'), o segundo parametro é o que será enviado, que no caso é o token.
    res.status(204).send(); //O status 204, além de dizer que a pagina de resposta é uma página em branco, mas também quer dizer que os cabeçalhos podem ser úteis.
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
