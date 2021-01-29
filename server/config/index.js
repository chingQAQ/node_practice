require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
import path from 'path';
export const LINE_SDK_CONFIG = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}