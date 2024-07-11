import { pollResults } from '../index.js';
import fs from 'fs';
import { performBotAction } from '../utils.js';
/**
 *
 * @param {TelegramBot} bot
 */
export const onCustomPlayer = bot =>
  bot.onText(/\/customplayer (.+)/, (msg, [, name]) => {
    const chatId = msg.chat.id;

    if (!pollResults[chatId]) {
      pollResults[chatId] = {};
    }

    const hasAlreadyJoined = pollResults[chatId][name] === 0;

    pollResults[chatId][name] = hasAlreadyJoined ? 1 : 0;

    //const filename = `${chatId}.txt`; // Replace with your file name
    //const dataToAppend = JSON.stringify(pollResults[chatId]); // Data to append

    console.log('🚀 ~ bot.onText ~ pollResults:', pollResults);

    //// Append data to a file
    //fs.writeFile(filename, dataToAppend, 'utf8', err => {
    //  if (err) {
    //    console.error('Error appending data:', err);
    //    return;
    //  }
    //  console.log('Data appended successfully!');
    //});

    try {
      performBotAction(() =>
        bot.sendMessage(
          chatId,
          `${name} ${
            hasAlreadyJoined
              ? 'прибрано з наступної генерації ☝️'
              : 'буде врахований під час генерації команд ✅'
          }`
        )
      );
    } catch (e) {
      console.error(e);
    }
  });
