//IMPORTANTE -> Teremos uma função que vai pegar a senha original do usuário e, a partir dela, irá criar uma senha aleatória que chamamos de senha Hash. Nosso banco de dados irá armazenar a senha Hash e, quando o usuário digitar a sua senha, o nosso código vai pegar a senha Hash e comparar com a senha do usuário. Assim protegemos a senha original, armazenando apenas a senha Hash.
// Ainda assim, existem atacantes que conseguem gerar senhas Hash para conseguir acessar a conta do usuário e, caso o atacante tenha acesso ao nosso banco de dados, estariamos vulneráveis aos seus ataques. Para dificultar e impedir esse tipo de ataque, "temperamos" a função Hash para que ela receba uma string pseudo-aleatória de uso único, que iremos chamar de "salt", fazendo isso, nossa função irá combinar a senha mais o salt para criar o Hash. Mas ainda assim estariamos vulneráveis, pois o atacante poderia pegar o nosso salt, e nossa senha Hash, caso ele tenha acesso ao nosso banco de dados, e criar as senhas mais comuns com um gerador de senhas. Para evitar isso por completo, existe uma função que combina (senha, salt, custo). Esse custo vai determinar o quão lento uma função vai demorar pra ser executada, assim, podemos controlar a velocidade computacional do algorítmo, baseado na velocidade computacional da época. Conforme a velocidade computacional avança, precisamos apenas aumentar o valor do custo para controlarmos a velocidade em que o algorítmo é computado. Além disso, através da biblioteca que iremos utilizar, o salt será gerado automáticamente. Essa função é chamada de bcrypt, e na nossa aplicação iremos utilizar a função bcrypt.hash(senha, custo).
const usuariosDao = require('./usuarios-dao');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');
const bcrypt = require('bcrypt')

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.senhaHash = usuario.senhaHash;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return usuariosDao.adiciona(this);
  }

  async adicionaSenha(senha) {
    validacoes.campoStringNaoNulo(senha, 'senha');
    validacoes.campoTamanhoMinimo(senha, 'senha', 8);
    validacoes.campoTamanhoMaximo(senha, 'senha', 64);

    this.senhaHash = await Usuario.gerarSenhaHash(senha);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }

  
  async deleta() {
    return usuariosDao.deleta(this);
  }
  
  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }
  
  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }

  static lista() {
    return usuariosDao.lista();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return bcrypt.hash(senha, custoHash)
  }
}

module.exports = Usuario;
