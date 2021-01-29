import querystring from 'querystring';
import fetch from 'node-fetch';
import { postbackHandler } from './postback';
import { LINE_SDK_CONFIG } from '../config';

const typesHandler = {
  'postback': function (event) {
    if (event.postback.data.length > 0) {
      let data = querystring.parse(event.postback.data, null, null);
      data.action in postbackHandler
        ? postbackHandler[data.action](event, data)
        : postbackHandler['other'](event);
    }
  },
  'send': function (event) {
    fetch('https://api.line.me/v2/bot/message/broadcast', {
      body: JSON.stringify({
        "messages": [
          event.message
        ]
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LINE_SDK_CONFIG.channelAccessToken,
      },
    });
  },
  'other': function (event) {
    return Promise.resolve(null);
  },
}

export {
  typesHandler,
}