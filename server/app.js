require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { LINE_SDK_CONFIG } from './config';
import { typesHandler } from './util';
import * as line from '@line/bot-sdk';

const PORT = process.env.PORT || '3000';
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', '*');
  next();
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

// client
//   .getRichMenuList()
//   .then(async richMenu => {
//     // richMenu[0].richMenuId && await client.setRichMenuImage(richMenu[0].richMenuId, fs.createReadStream(path.join(__dirname, '..', 'public', 'rich_menu.jpg')));
//     await client.setDefaultRichMenu(richMenu[0].richMenuId);
//     return console.log('done');
//   })

// 1. user 發送訊息
app.post('/webhook', line.middleware(LINE_SDK_CONFIG), (req, res) => {
  const isSameSignature = signatureCheck(req, LINE_SDK_CONFIG.channelSecret);
  // 3. 傳送 request
  if (isSameSignature) {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => {
        return res.json(result)
      })
      .catch(err => console.log('err: ' + err));
  }
})

function handleEvent(event) {
  
  event.type in typesHandler
    ? typesHandler[event.type](event)
    : typesHandler['other'](event);
}

function signatureCheck(request, channelSecret) {
  const body = JSON.stringify(request.body);
  const xLineSignature = request.get('X-Line-Signature');
  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body).digest('base64');

  return xLineSignature === signature;
}

app.listen(PORT);
