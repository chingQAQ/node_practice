
export function flexHero(mediaMeta) {
  return mediaMeta && {
    "type": "image",
    "url": mediaMeta.url,
    "size": "full",
    "aspectMode": "cover",
    "aspectRatio": "320:213"
  };
}

export function flexStructure(hero, index, { host }) {
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
          "text": index.title || '',
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
                  "text": index.excerpt || '',
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
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "postback",
            "label": "action",
            "data": "data=123",
          },
          "style": "link"
        },
        {
          "type": "button",
          "action": {
            "type": "uri",
            "label": "goto",
            "uri": `${host}/f/${index.forumAlias}/p/${index.id}`,
          },
          "style": "primary"
        }
      ]
    }
  }
}
