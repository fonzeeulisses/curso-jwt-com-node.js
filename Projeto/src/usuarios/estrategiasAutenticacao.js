//IMPORTANTE -> Aqui iremos criar a nossa estratégia de autenticação. Ela vai nos ajudar a criar o nosso sistema de login
// Basicamente, aqui iremos receber o usuário e senha do cliente, e verificar se, de fato, esse cliente existe.
// 1) Precisamos primeiro instalar 2 módulos: passport e o passport-local.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy; //Assim como importamos o módulo de LocalStrategy, faremos a mesma coisa com o BearerStrategy, assim que instalarmos ele. Para instalar: npm install passport-http-bearer@1.0.1(@: versão utilizada no curso)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //Importamos a biblioteca "jsonwebtoken" para montar a nossa BearerStrategy.

const Usuario = require('./usuarios-modelo'); // Como precisamos do nosso usuário, vamos importa-lo pra cá.
const { InvalidArgumentError } = require('../erros'); // Não é interessante jogarmos erros genéricos para a nossa aplicação, sendo assim, exportamos nossos erros customizados, no caso o de InvalidArgumentError.


function verificaUsuario(usuario) { // O que acontece se o nosso usuário for nulo, ou seja, não existe em nossa base de dados? Pra isso, criamos a função verificaUsuário(), que vai receber nosso usuário para verificar. Caso ele não exista, retornamos um erro para o cliente.
    if(!usuario) {
        throw new InvalidArgumentError('Não existe usuário com esse e-mail');
    }
}

async function verificaSenha(senha, senhaHash) { // Caso o usuário exista, continuamos a lógica do programa para verificar se a senha do mesmo é válida ou não. Pra isso criamos uma nova função, que vai receber a senha do usuário e a senhaHash.
    const senhaValida = await bcrypt.compare(senha, senhaHash); // Pra comparar a senha com a senhaHash, utilizamos o método .compare do bcrypt, que pede como argumento justamente a senha e a senhaHash. Como esse método do bcrypt retorna uma "promisse", utilizamos async, await.
    if(!senhaValida) {
        throw new InvalidArgumentError('email ou senha inválidos')
    }
}

passport.use( // Aqui daremos início a nossa estratégia. Vamos usar o método passport.use, que irá receber nosso LocalStrategy, que irá recebe 2 argumentos: o primeiro será um objeto opicional, com algumas opções de modificação, o segundo vai ser a nossa função de verificação. da estratégia local.
    new LocalStrategy({
        usernameField: 'email', // Como não estamos utilizando os nomes padrões do passport, vamos ter que fazer algumas modificações: aqui, ao invés de usar no usernameField: 'username', vamos usar usernameField: 'email'.
        passwordField: 'senha', // Como não utilizamos passwordField: 'password', substituimos por passwordField: 'senha'.
        session: false //IMPORTANTE -> Como nosso sistema de login não utiliza sessões, temos que configurar session: false.
    }, async (email, senha, done) => { // aqui temos nossa função de verificação, que recebe 3 parametros. Destacremos o "done", que vai ser uma função callback do "passport autenthcate". O objetivo dessa função é se as credenciais do usuário estiverem inválidas, essa função devolve o usuário para a função callback do "passport autenthcate"
        try {
            const usuario = await Usuario.buscaPorEmail(email); // Já temos nosso usuário, então aqui vamos buscar o email dele. Esse método devolve uma "promisse", sendo assim, usamos async, await. Usamos o try, catch para tratar os erros, caso nossa busca dê errado. Então colocamos nossa buscaPorEmail() aqui no try, e no catch colocamos a função "done", passando o erro que ocorreu.
            verificaUsuario(usuario);
            await verificaSenha(senha, usuario.senhaHash); // Após verificarmos se está tudo correto com o usuário e senha, devemos chama-los aqui. Como se trata de uma "promisse" devemos colocar o await.

            done(null, usuario); // Para concluir, após todas as verificações, chamamos a função "done", passando null, pois não possui erro, e o usuário, mostrando que esse cliente está autenticado. Próximo passo: implementar isso nas nossas rotas de autenticação.
        } catch (error) {
            done(error);
        }
    })
);

passport.use( // assim como na estratégia anterior(LocalStrategy), aqui vamos configurar a nossa nova estratégia usando o BearerStrategy
    new BearerStrategy((token, done) => { //Nessa estratégia, não iremos precisar de objeto de opções. Iremos precisar apenas do token e do done. Nossa função terá como objetivo verificar se o token está valido e recuperar o payload a partir dele. Para isso, será necessário importarmos a biblioteca "jsonwebtoken"
        const payload = jwt.verify(token, process.env.CHAVE_JWT); //Iremos utilizar o jwt.verify(). Esse método vai receber o token e a nossa senha. Após isso, caso esteja tudo certo, ele devolve o payload, caso contrário, ele devolve um erro. Como ele irá devolver o payload, vamos coloca-lo em uma variável "payload".
    })
)