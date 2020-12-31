import querystring from 'querystring';
import fetch from 'node-fetch';

export const HOST = 'https://www.dcard.tw';
const API_ENDPOINT = 'https://www.dcard.tw/service/api/v2';

export async function api(path, { query, headers } = {}) {
  // const endpoint = '/' + path + '?popular=true';
  const url = `${API_ENDPOINT}/${path}?popular=true`
  console.log(querystring.stringify({popular: true}));
  try {
    const result = await fetch(url, { headers });
    const data = result.json();

    if (data.error) throw data;

    return data;
  } catch(err) {
    console.log(err);
  }
}

