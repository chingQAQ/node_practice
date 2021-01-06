const express = require('express');
const path = require('path');
const { api } = require('./apis');
const line = require('@line/bot-sdk');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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

  let message = [];

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 4. response
  if (event.type === 'message' || event.message.type === 'text') {
    
    if (event.message.text === 'posts') {
      const fetchDCard = await api(event.message.text, { query: {'popular': true}});
      message = fetchDCard.slice(0, 12);
    }
    
  }

  message = message.map(i => {
    const hero = i.mediaMeta[0] && { 
      "type": "image",
      "url": i.mediaMeta[0].url,
      "size": "full",
      "aspectMode": "cover",
      "aspectRatio": "320:213"
    };

    return {
      "type": "bubble",
      "size": "kilo",
      hero,
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": i.title || '',
            "weight": "bold",
            "size": "sm",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": i.excerpt || '',
                    "wrap": true,
                    "color": "#8c8c8c",
                    "size": "xs",
                    "flex": 5
                  }
                ]
              }
            ]
          }
        ],
        "spacing": "sm",
        "paddingAll": "13px"
      }
    }
  })

  console.log(message);

  // 5. 回傳資料
  return client.replyMessage(event.replyToken, {
    "type": "flex",
    "altText": "this is a flex message",
    "contents": {
      "type": "carousel",
      "contents": message
    }
  });
}

app.listen(PORT);
