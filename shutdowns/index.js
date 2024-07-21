import TelegramBot from 'node-telegram-bot-api';

const token = process.env.SHUTDOWNS_TELEGRAM_BOT_TOKEN;

// dev
const shutdownsBot = new TelegramBot(token, { polling: true });

/**
 * @type {Record<import('node-telegram-bot-api').User['id'], 1 | 2 | 3 | 4 | 5 | 6>}
 */
//const userSubscriptions = {};

/**
 * @type {('possible' | 'off' | 'on' )[][]}
 */
const schedule = [
  // Monday
  [
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',
  ],
  // Tuesday
  [
    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
  ],
  // Wednesday
  [
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
  ],
  // Thursday
  [
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',
  ],
  //Friday
  [
    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
  ],
  // Saturday
  [
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
  ],
  // Sunday
  [
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',

    'off',
    'off',
    'off',
    'off',
    'possible',
    'possible',
    'possible',
    'on',
    'on',
  ],
];

export default () => {
  shutdownsBot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    shutdownsBot.sendMessage(chatId, 'Графіки відключень');
  });

  //shutdownsBot.onText(/\/subscribe (\d)/, ({ chat, from }, [, group]) => {
  //  userSubscriptions[from.id] = group;
  //  shutdownsBot.sendMessage(chat.id, `Ви підписалися на групу ${group}`);
  //});

  shutdownsBot.onText(/\/status/, msg => {
    const chatId = msg.chat.id;

    //if (!userSubscriptions[msg.from.id]) {
    //  return shutdownsBot.sendMessage(chatId, 'Підпишіться на свою групу');
    //}

    const today = getDateInTimeZone('Europe/Kyiv');
    const day = (today.getDay() || 7) - 1;
    const hour = today.getHours();

    const currentValue = schedule[day][hour];

    switch (currentValue) {
      case 'off':
        {
          const nextPossibleLightOn = findNextValue(day, hour, 'possible');
          const nextLightOnForSure = findNextValue(day, hour, 'on');

          shutdownsBot.sendMessage(
            chatId,
            `<strong>По графіку світло відсутнє</strong>\nможливо увімкнуть о ${nextPossibleLightOn}\nбуде світло точно о ${nextLightOnForSure}`,
            { parse_mode: 'HTML' }
          );
        }

        break;

      case 'possible':
        {
          const nextLightOnForSure = findNextValue(day, hour, 'on');
          const nextLightOff = findNextValue(day, hour, 'off');

          shutdownsBot.sendMessage(
            chatId,
            `<strong>По графіку світло можливо відсутнє</strong>\nсвітло буде точно о ${nextLightOnForSure}\nНаступне вимкнення о ${nextLightOff}`,
            { parse_mode: 'HTML' }
          );
        }
        break;

      default: {
        const nextLightOff = findNextValue(day, hour, 'off');

        shutdownsBot.sendMessage(
          chatId,
          `<strong>Світло є 🥳</strong>\nСвітло вимкнуть о ${nextLightOff}`,
          {
            parse_mode: 'HTML',
          }
        );
      }
    }
  });
};

/**
 * @param {day} number
 * @param {hour} number
 * @param {'on' | 'possible' | 'off'} key
 */
function findNextValue(day, hour, key) {
  let targetDay = day;

  let nextValue = schedule[targetDay].findIndex(
    (value, index) => value === key && index > hour
  );

  while (nextValue === -1) {
    targetDay++;

    if (targetDay >= schedule.length) {
      targetDay = 0;
    }

    nextValue = schedule[targetDay].findIndex(
      (value, index) => value === key && (targetDay !== day || index > hour)
    );
  }

  return nextValue;
}

// Function to create a Date object in a specific time zone
function getDateInTimeZone(timeZone) {
  // Get the current date and time in the specified time zone
  const now = new Date();
  const localTime = now.toLocaleString('en-US', { timeZone: timeZone });
  return new Date(localTime);
}
