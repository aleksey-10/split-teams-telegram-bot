import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { onStart } from './events/start.js';
import { onCreatePoll } from './events/poll.js';
import { onPollAnswer } from './events/pollAnswer.js';
import { onCallbackQuery, onSkill } from './events/skill.js';
import { onAdd } from './events/add.js';
import { onGo } from './events/go.js';
import { onPlayers } from './events/players.js';
import { onAll } from './events/all.js';
import express from 'express';
import bodyParser from 'body-parser';
import { performBotAction } from './utils.js';
import { PrismaClient } from '@prisma/client';
import shutdowns from './shutdowns/index.js';
shutdowns();

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


async function main() {
  [
    onStart,
    onCreatePoll,
    onPollAnswer,
    onSkill,
    onAdd,
    onGo,
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
