require('dotenv').config() //Aqui chamamos o dotenv. Fazendo isso, ele irá configurar todas as variáveis de ambiente do nosso programa.
const app = require('./app');
const port = 3000;
const db = require('./database');

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
