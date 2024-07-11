import { pollResults } from "../index.js";
import { performBotAction } from "../utils.js";

/**
 *
 * @param {TelegramBot} bot
 */
export const onPlayers = (bot) =>
  bot.onText(/\/players/, (msg) => {
    const chatId = msg.chat.id;

    const usernames = Object.entries(pollResults[chatId] || {})
      .filter(([_, value]) => value === 0)
      .map(([name]) => name);

    performBotAction(() =>
      bot.sendMessage(
        chatId,
        `По останньому голосуванню ${
          usernames.length
        } плюсів: \n${usernames.join("\n")}`,
      ),
    );
  });
