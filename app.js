import express from 'express';
import path from 'path';
import { api } from './src/apis';
const app = express();

require('dotenv').config({ path: path.join(__dirname, '.env')});

app.get('/', async (req, res) => {
  const me = await api('posts');
  res.send(me);
})
app.listen(process.env.BASE_PORT);
