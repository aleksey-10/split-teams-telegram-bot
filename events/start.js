import { performBotAction } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 */
export const onStart = bot =>
  bot.onText(/\/start/, msg => {
    console.log('🚀 ~ start:', msg);

    performBotAction(() => bot.sendMessage(msg.chat.id, 'Привіт! Футбол?'));
  });
