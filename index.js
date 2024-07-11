import 'dotenv/config'
import TelegramBot from "node-telegram-bot-api";
import { onStart } from "./events/start.js";
import { onCreatePoll } from "./events/createPoll.js";
import { onPollAnswer } from "./events/pollAnswer.js";
import { onCallbackQuery, onSkill } from "./events/skill.js";
import { onCustomPlayer } from "./events/customPlayer.js";
import { onGenerateTeams } from "./events/generateTeams.js";
import { onPlayers } from "./events/players.js";
import { onAll } from "./events/all.js";
import express from "express";
import bodyParser from "body-parser";
import { performBotAction } from "./utils.js";

const token = process.env.TELEGRAM_TOKEN;

// dev
const bot = new TelegramBot(token, { polling: true });

// prod
//const url = 'https://football-bot-psi.vercel.app'; // Add this environment variable in Vercel project settings

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
  "aleksey_10 (Oleksii)": {
    level: 2,
  },
  "whoistwixy (bodya)": {
    level: 1,
  },
  "nik01314 (Никита)": {
    level: 2,
  },
  "voxat1488 (Вохa☠️)": {
    level: 2,
  },
  "Prontik (Artem Prontenko)": {
    level: 1,
  },
  "djsvej (DJ SVEJ)": {
    level: 1,
  },
  "traxxse (krisong)": {
    level: 0,
  },
  "maksvatsiuk (Makc Vatsiuk)": {
    level: 0,
  },
  "omelchenkodmitriy (Дмитрій Омельченко)": {
    level: 1,
  },
  "ice_vb (Valeriy Bozhenko)": {
    level: 2,
  },
  "vesely4ak (whatislove)": {
    level: 0,
  },
  "mk_nolimits (Макар)": {
    level: 0,
  },
  "Apso110 (А)": {
    level: 2,
  },
  "Danyakrya (Даня Левченко)": {
    level: 1,
  },
  "sanyaluchdance58 (Сашка)": {
    level: 1,
  },
  Влад: {
    level: 0,
  },
  "envoyeed (Андрей)": {
    level: 0,
  },
  Олег: {
    level: 2,
  },
  Саня: {
    level: 2,
  },
  Ярик: {
    level: 1,
  },
  "bomjkolydun (Степаша 🧐)": {
    level: 2,
  },
  Artem: {
    level: 2,
  },
  Олександр: {
    level: 2,
  },
  "Tretyak27 (Влад)": {
    level: 1,
  },
  "SnimaemSanechku (Саня)": {
    level: 1,
  },
  "brs117 (Андрей)": {
    level: 0,
  },
  "bytexs (🥷🏻)": {
    level: 1,
  },
  "ospayne (Макс)": {
    level: 0,
  },
  "vitaliy9386 (Виталий)": {
    level: 2,
  },
  "Dimtet (Дім)": {
    level: 2,
  },
  Сёма: {
    level: 2,
  },
};

export const pollResults = {
  "-1001930766161": {
    "djsvej (DJ SVEJ)": 0,
    "Prontik (Artem Prontenko)": 1,
    "aleksey_10 (Oleksii)": 1,
    "vesely4ak (whatislove)": 0,
    "maksvatsiuk (Makc Vatsiuk)": 0,
    Ярик: 0,
    "Zxcsobachka (Zxc_sobachka🖤⌯)": 1,
    "whoistwixy (bodya)": 1,
    "sanyaluchdance58 (Сашка)": 1,
    "DenysKulikov (Денис)": 0,
    "ice_vb (Valeriy Bozhenko)": 1,
    "nik01314 (Никита)": 0,
    "voxat1488 (Вохa☠️)": 2,
    Олександр: 1,
    "omelchenkodmytrii (Дмитрій Омельченко)": 1,
    "SnimaemSanechku (Саня)": 0,
    "ellxc1wn (ㅤ)": 0,
    "ShevchukArtur (Артур Шевчук)": 1,
    "Bogdan Tsapenko": 0,
    Олег: 0,
    "traxxse (krisong)": 0,
    Artem: 0,
    "Danyakrya (Даня Левченко)": 1,
    "bomjkolydun (Степаша 🧐)": 0,
    "mk_nolimits (Макар)": 0,
    "brs117 (Андрей)": 1,
    Влад: 1,
    "bibabobib (Timur)": 1,
    Саенко: 0,
    "ospayne (Макс)": 0,
    "bytexs (🥷🏻)": 1,
    "+1 ще хтось": 0,
    "Дима Горб": 1,
    "Apso110 (А)": 0,
  },
  "-4258926914": {
    "aleksey_10 (Oleksii)": 0,
    вася: 0,
    Олег: 0,
    Сашко: 0,
    Тарас: 0,
    Пітер: 0,
  },
};

export const pollChatMap = new Map().set(
  "5219974582928149086",
  "-1001930766161",
);

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
].forEach((cb) => cb(bot));

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;

  performBotAction(() => bot.sendMessage(chatId, "See you later 🫡"));
});

bot.onText(/\/chatid/, (msg) => {
  const chatId = msg.chat.id;

  performBotAction(() => bot.sendMessage(chatId, chatId));
});

`aleksey_10 (Oleksii) -- option_middle
whoistwixy (bodya) -- option_low
nik01314 (Никита) -- option_middle
voxat1488 (Вохa☠️) -- option_low
Prontik (Artem Prontenko) -- option_middle
djsvej (DJ SVEJ) -- option_middle
traxxse (krisong) -- option_low
maksvatsiuk (Makc Vatsiuk) -- option_low
omelchenkodmitriy (Дмитрій Омельченко) -- option_middle
ice_vb (Valeriy Bozhenko) -- option_low
vesely4ak (whatislove) -- option_low
mk_nolimits (Макар) -- option_low
Apso110 (А) -- option_middle
Apso110 (А) -- option_low
Danyakrya (Даня Левченко) -- option_middle`
  .split(/\n/)
  .reduce((acc, current) => {
    const [username, choise] = current.split(" -- ");

    const levels = { option_low: 0, option_middle: 1, option_strong: 2 };

    return { ...acc, [username]: { level: levels[choise] } };
  }, {});

//const app = express();
//app.use(bodyParser.json());

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

//app.get('/', (req, res) => {
//  res.send('Telegram bot is running');
//});

//const port = 5001;

//app.listen(port, function () {
//  console.log('listening on port ' + port);
//});

//export default app;
