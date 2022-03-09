const axios = require('axios');

module.exports = async ( codigo ) => {
    let status = '';

    await axios.get(`https://proxyapp.correios.com.br/v1/sro-rastro/${codigo}`)
      .then(response => response.data.objetos[0])
      .then(objeto => {
        if (objeto.eventos) {
          status = `[${objeto.codObjeto}] ${objeto.eventos[0].descricao}`;
        } else {
          status = `[${objeto.codObjeto}] ${objeto.categoria} Não encontrado/enviado\n`;
        }
      })
      .catch(err => {});
    
    return status;
}