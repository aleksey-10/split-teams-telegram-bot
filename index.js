import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { onStart } from './events/start.js';
import { onCreatePoll } from './events/createPoll.js';
import { onPollAnswer } from './events/pollAnswer.js';
import { onCallbackQuery, onSkill } from './events/skill.js';
import { onCustomPlayer } from './events/customPlayer.js';
import { onGenerateTeams } from './events/generateTeams.js';
import { onPlayers } from './events/players.js';
import { onAll } from './events/all.js';
import express from 'express';
import bodyParser from 'body-parser';
import { performBotAction } from './utils.js';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const token = process.env.TELEGRAM_TOKEN;

// dev
const bot = new TelegramBot(token, { polling: true });

// prod
//const url = 'https://split-teams-telegram-bot.onrender.com'; // Add this environment variable

//const bot = new TelegramBot(token, { webHook: true });

//(async () => {
//  try {
//    await bot.setWebHook(`${url}/api/bot`);
//    console.log(`Webhook set to: ${url}/api/bot`);
//  } catch (error) {
//    console.error('Error setting webhook:', error);
//  }
//})();

export const allPlayers = {
  'aleksey_10 (Oleksii)': {
    level: 2,
  },
  'whoistwixy (bodya)': {
    level: 1,
  },
  'nik01314 (Никита)': {
    level: 2,
  },
  'voxat1488 (Вохa☠️)': {
    level: 2,
  },
  'Prontik (Artem Prontenko)': {
    level: 1,
  },
  'djsvej (DJ SVEJ)': {
    level: 1,
  },
  'traxxse (krisong)': {
    level: 0,
  },
  'maksvatsiuk (Makc Vatsiuk)': {
    level: 0,
  },
  'omelchenkodmitriy (Дмитрій Омельченко)': {
    level: 1,
  },
  'ice_vb (Valeriy Bozhenko)': {
    level: 2,
  },
  'vesely4ak (whatislove)': {
    level: 0,
  },
  'mk_nolimits (Макар)': {
    level: 0,
  },
  'Apso110 (А)': {
    level: 2,
  },
  'Danyakrya (Даня Левченко)': {
    level: 1,
  },
  'sanyaluchdance58 (Сашка)': {
    level: 1,
  },
  Влад: {
    level: 0,
  },
  'envoyeed (Андрей)': {
    level: 0,
  },
  Олег: {
    level: 2,
  },
  'bomjkolydun (Степаша 🧐)': {
    level: 2,
  },
  'Tretyak27 (Влад)': {
    level: 1,
  },
  'SnimaemSanechku (Саня)': {
    level: 1,
  },
  'brs117 (Андрей)': {
    level: 0,
  },
  'bytexs (🥷🏻)': {
    level: 1,
  },
  'ospayne (Макс)': {
    level: 0,
  },
  'vitaliy9386 (Виталий)': {
    level: 2,
  },
  'Dimtet (Дім)': {
    level: 2,
  },
  Сёма: {
    // manually add to the database
    level: 2,
  },
  Саня: {
    // manually add to the database
    level: 2,
  },
  Ярик: {
    // manually add to the database
    level: 1,
  },
  Artem: {
    // manually add to the database
    level: 2,
  },
  Олександр: {
    // manually add to the database
    level: 2,
  },
};

//fs.readFile('5219974582928149086.txt', 'utf8', (err, data) => {
//  if (err) {
//    console.error(`Error reading data:`, err);
//    return;
//  }

//  const parsedData = JSON.parse(data);

//  if (parsedData) {
//    pollResults['5219974582928149086'] = parsedData;
//    console.log(
//      '🚀 ~ fs.readFile ~ parsedData:',
//      parsedData,
//      Object.keys(parsedData).length
//    );
//  }
//});

async function main() {
  [
    onStart,
    onCreatePoll,
    onPollAnswer,
    onSkill,
    onCustomPlayer,
    onGenerateTeams,
    onPlayers,
    onCallbackQuery,
    onAll,
  ].forEach(cb => cb(bot, prisma));

  bot.onText(/\/stop/, msg => {
    const chatId = msg.chat.id;

    performBotAction(() => bot.sendMessage(chatId, 'See you later 🫡'));
  });

  bot.onText(/\/chatid/, msg => {
    const chatId = msg.chat.id;

    performBotAction(() => bot.sendMessage(chatId, chatId));
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const app = express();
app.use(bodyParser.json());

//app.post('/api/bot', (req, res) => {
//  try {
//    console.log('Received request headers:', req.headers);
//    console.log('Received request body:', JSON.stringify(req.body, null, 2));
//    bot.processUpdate(req.body);
//    res.sendStatus(200);
//  } catch (error) {
//    console.error('Error processing update:', error);
//    res.sendStatus(500);
//  }
//});

app.get('/', (req, res) => {
  res.send('Telegram bot is running');
});

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log('listening on port ' + port);
});

export default app;
