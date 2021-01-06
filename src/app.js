require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import path from 'path';
import querystring from 'querystring';
import { HOST, api } from './apis';
import { flexHero, flexStructure } from './util';

import * as line from '@line/bot-sdk';

const LINE_SDK_CONFIG = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}
const PORT = process.env.PORT || '3000';

const app = express();
const client = new line.Client(LINE_SDK_CONFIG);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/tracking', (req, res) => {
  res.render('tracking')
})

// 1. user 發送訊息
app.post('/callback/', line.middleware(LINE_SDK_CONFIG), (req, res) => {
  // 3. 傳送 request
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      return res.json(result)
    })
    .catch(err => console.log(err));
})

async function handleEvent(event) {
  console.log(event);

  let message = [];

  if (event.type === 'postback' && event.postback.data.length > 0) {
    let data = querystring.parse(event.postback.data, null, null);
    if (data.action === 'dcard') {
      const fetchDCard = await api(data.item, { query: { 'popular': true } });

      message = fetchDCard.slice(0, 12).map(i => {
        const hero = flexHero(i.mediaMeta[0]);
        return flexStructure(hero, i, { host: HOST });
      })

      return client.replyMessage(event.replyToken, {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
          "type": "carousel",
          "contents": message
        }
      });
    } else {
      return client.replyMessage(event.replyToken, {
        "type": "text",
        "text": "$ 找不到指令喔 $",
        "emojis": [
          {
            "index": 0,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "164"
          },
          {
            "index": 9,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "164"
          }
        ]
      });
    }
  }

  // 4. response
  if (event.type === 'message' || event.message.type === 'text') {

    if (event.message.text === '!功能') {
      return client.replyMessage(event.replyToken, {
        "type": 'text',
        "text": '我還在測試拉顆顆顆不要急喔(Quick reply)',
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "postback",
                "label": "低能卡熱門12則貼文",
                "data": "action=dcard&item=posts",
              }
            },
            {
              "type": "action",
              "action": {
                "type": "cameraRoll",
                "label": "Send photo"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "camera",
                "label": "Open camera"
              }
            }
          ]
        }
      });
    }
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
}

app.listen(PORT);
