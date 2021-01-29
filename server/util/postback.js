import { flexHero, flexStructure } from './flex-message';
import { HOST, api } from '../apis';
import * as line from '@line/bot-sdk';
import { LINE_SDK_CONFIG } from '../config';
const client = new line.Client(LINE_SDK_CONFIG);
const postbackHandler = {
  'dcard': async function ({ replyToken: token }, data) {
    let message = [];
    const fetchDCard = await api(data.item, { query: { 'popular': true } });
    message = fetchDCard.slice(0, 12).map(i => {
      const hero = flexHero(i.mediaMeta[0]);
      return flexStructure(hero, i, { host: HOST });
    })
    return client.replyMessage(token, {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "carousel",
        "contents": message
      }
    });
  },
  'nextRich': function ({ replyToken: token }) {
    return client.replyMessage(token, {
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
  },
  'tool': function ({ replyToken: token }) {
    return client.replyMessage(token, {
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
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "error",
              "data": "action=error",
            }
          }
        ]
      }
    });
  },
  'other': function ({ replyToken: token }) {
    return client.replyMessage(token, {
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
  },
}

export {
  postbackHandler,
}