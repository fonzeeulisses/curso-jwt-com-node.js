const usuariosControlador = require('./usuarios-controlador');
const passport = require('passport')

module.exports = app => {
  app
     .route('/usuario/login')
     .post(passport.authenticate('local', {session: false}), usuariosControlador.login); // Criamos aqui a nossa rota de autenticação, após importar o passport, utilizamos o método .authenticate. Nesse método, podemos utilizar 2 ou mais parametros: o primeiro é a estrategia que iremos utilizar, no caso, a estratégia 'local', e o segundo parametro, está relacionado ao fato de que não estamos mais utilizando sessões, nesse caso, utilizamos um objeto de configuração "{session: false}".

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(usuariosControlador.deleta);
};
