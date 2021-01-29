<script>
  const crypto = require('crypto');

  const LINE_SDK_CONFIG = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  }

  export default {
    name: 'message-api',
    data: () => ({
      text: '',
      messages: {},
      signature: '',
    }),
    methods: {
      submit: async function(e) {
        this.message = {
          type: 'text',
          text: this.text,
        }

        const body = JSON.stringify({
          events: [
            {
              type: 'send',
              message: this.message,
            }
          ]
        })

        this.signature = crypto
          .createHmac('SHA256', '47e52f4a8a9877e237658aacebec0fe1')
          .update(body).digest('base64')

          fetch('https://acb97cfcad40.ngrok.io/webhook', {
            body: body,
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': 'http://localhost:8080',
              'X-Line-Signature': this.signature,
            },
          }).then(res => console.log(res)).catch(err => console.log(err));
        

        // postData().then((result) => {
        //   console.log(result)
        // }).catch((err) => {
        //   console.log(err)
        // });

      }
    },
  }
</script>

<template>
  <div >
    <!-- <input type="text" v-bind="title"> -->
    <textarea name="" id="" cols="30" rows="10" v-model="text"></textarea>
    <button type="submit" @click="submit">submit</button>
  </div>
</template>