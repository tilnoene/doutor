const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async ( user ) => {
    await axios.get(`https://olimpiada.ic.unicamp.br/passadas/OBI2021/qmerito/pu/`)
      .then(response => user.send('Saiu o quadro de medalhas da OBI!')
      ).catch(err => {});
}