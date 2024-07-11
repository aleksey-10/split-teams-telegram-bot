import { pollChatMap, pollResults } from '../index.js';
import { performBotAction } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 */
export const onCreatePoll = bot =>
  bot.onText(/\/createpoll (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    const message = match[1];
    //  const stadium = getLastWordOfMessage(message);

    //  const isAvailableField = availableFields.includes(stadium);

    //  if (!isAvailableField) {
    //    bot.sendMessage(
    //      chatId,
    //      `не розумію на якому полі граємо 😢. Доступні варіанти: ${availableFields.join(
    //        ', '
    //      )}`
    //    );
    //  } else {

    pollResults[chatId] = {};

    performBotAction(() =>
      bot
        .sendPoll(chatId, message, ['+', '-'], {
          is_anonymous: false,
        })
        .then(({ poll }) => {
          pollChatMap.set(poll.id, chatId);

          console.log('🚀 ~ .then ~ chatId:', { chatId, poll });
        })
    );

    //  }
  });
