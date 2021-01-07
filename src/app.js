require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import path from 'path';
import querystring from 'querystring';
import { HOST, api } from './apis';
import { flexHero, flexStructure } from './util';
import fs from 'fs';

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
  res.render('index');
})

app.get('/tracking', (req, res) => {
  res.render('tracking');
})

const richmenu = {
  size: {
    width: 1200,
    height: 810
  },
  selected: false,
  name: 'Laibb Rich!',
  chatBarText: 'Laibb tap',
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 400,
        height: 810,
      },
      action: {
        type: "postback",
        label: "Tool",
        data: "action=tool",
      },
    },
    {
      bounds: {
        x: 400,
        y: 0,
        width: 400,
        height: 810,
      },
      action: {
        type: "postback",
        label: "Tool",
        data: "action=none",
      },
    },
    {
      bounds: {
        x: 800,
        y: 0,
        width: 400,
        height: 810,
      },
      action: {
        type: "postback",
        label: "Tool",
        data: "action=nextRich",
      },
    }
  ]
}

// client.createRichMenu(richmenu).then(result => console.log(result)).catch(err => console.log(err));

client
  .getRichMenuList()
  .then(async richMenu => {
    richMenu[0].richMenuId && await client.setRichMenuImage(richMenu[0].richMenuId, fs.createReadStream(path.join(__dirname, 'public', 'rich_menu.jpg')));
    await client.setDefaultRichMenu(richMenu[0].richMenuId);
    return console.log('done');
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
    } else if (data.action === 'nextRich') {
      return client.replyMessage(event.replyToken, {
        "type": "text",
        "text": "$ 預計是下一頁Rich menu呀",
        "emojis": [
          {
            "index": 0,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "163"
          },
        ]
      })
    } else if (data.action === 'tool') {
      return client.replyMessage(event.replyToken, {
        "type": 'text',
        "text": '我還在測試拉顆顆顆(Quick reply)',
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

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
}

app.listen(PORT);
