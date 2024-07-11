import TelegramBot from 'node-telegram-bot-api';
import { pollResults, pollChatMap } from '../index.js';
import { getUserName } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 */
export const onPollAnswer = bot =>
  bot.on('poll_answer', pollAnswer => {
    const { poll_id } = pollAnswer;

    const chatId = pollChatMap.get(poll_id);

    const username = getUserName(pollAnswer.user);

    const [selectedOption] = pollAnswer.option_ids;

    if (!pollResults[chatId]) {
      pollResults[chatId] = {};
    }

    pollResults[chatId][username] = selectedOption;

    console.log('🚀 ~ onPollAnswer:', { pollResults, pollAnswer });

    //const filename = `${poll_id}.txt`; // Replace with your file name
    //const dataToAppend = JSON.stringify(pollResults[poll_id]); // Data to append

    // Append data to a file
    //fs.writeFile(filename, dataToAppend, 'utf8', err => {
    //  if (err) {
    //    console.error('Error appending data:', err);
    //    return;
    //  }
    //  console.log('Data appended successfully!');
    //});
  });
