const querystring = require('querystring');
const fetch = require('node-fetch');

const API_ENDPOINT = 'https://www.dcard.tw/service/api/v2';

module.exports = {
  HOST: 'https://www.dcard.tw',
  api: async function (path, { query, headers } = {}) {
    const filtered = {};
    for (const i of Object.keys(query)) {
      if (query[i] !== null) {
        filtered[i] = query[i];
      }
    }

    const endpoint = `${API_ENDPOINT}/${path}${Object.keys(filtered).length > 0 ? `?${querystring.stringify(filtered)}` : ''}
  `
    try {
      const result = await fetch(endpoint, { headers });
      const data = await result.json();

      if (data.error) throw data;
      if (data.length) return data;

    } catch (err) {
      console.log(err);
    }
  } 
}
