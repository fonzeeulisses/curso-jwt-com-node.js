/* IMPORTANTE -> JWT(Json Web Token) é um formato que permite entregar ao cliente um ID "assinado", ou seja, único, ao qual somente o cliente poderá utilizá-lo após fazer o seu login no site. Mas como o JWT faz isso? Bom, vamos chamar a informação(ID) de TOKEN. O JWT vai transformar essa inforamção em json: 

{
  "id_usuario": 42 -> Payload
}

PAYLOAD -> é o nome que damos a sessão a qual o servidor pega o TOKEN e o transforma em JSON

Em seguida, o servidor cria uma outra sessão, também codificada em json chamada "cabeçalho":

{
  "alg": "HS256"  -> Algorítmo de assinatura usado(nesse caso, será o HMAC-sha256, variação do algorítimo de função de hash modificado para também receber uma senha)
  "typ": "JWT"  -> Aqui é a informação do tipo do token, no caso JWT(json web token)
}

E por fim, temos também a sessão de assinatura, que será o resultado da função 

HMAC-SHA256 (
  Base64Url(cabeçalho) 
  + "."
  + Base64Url(payload),
  "senha secreta" -> senha guardada apenas pelo servidor
)

Depois de coletar essas informações, O JWT irá pegar cada uma dessas sessões, codificar novamente em Base64Url(variação da Base64) e concatena-los, separando-os por ".". O resultado será uma string, com as 3 informações, que em seguida será enviado para o nosso usuário.

Base64Url(payload)
+ "."
Base64Url(cabeçalho)
+ "."
Base64Url(Assinatura)

Mas como que a assinatura colocada no token garante a integridade dele? Primeiro ele pega o token que o cliente vai enviar e faz o processo reverso, gerando uma nova assinatura, que vamos chamar de assinatura ideal. Assim ele compara ambas e caso estejam corretas, o servidor tem certeza que o token foi emitido por ele mesmo e o usuário é verdadeiro

*/

module.exports = {
  rotas: require('./usuarios-rotas'),
  controlador: require('./usuarios-controlador'),
  modelo: require('./usuarios-modelo'),
  estrategiasAutenticacao: require('./estrategiasAutenticacao') // Aqui estamos importando a estrategia de autenticação que criamos, para que possamos utilizala em outros arquivos
}