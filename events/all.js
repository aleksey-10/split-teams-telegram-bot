import { allPlayers } from "../index.js";
import { performBotAction } from "../utils.js";

/**
 *
 * @param {TelegramBot} bot
 */
export const onAll = (bot) =>
  bot.onText(/\/all/, (msg) => {
    const chatId = msg.chat.id;

    const users = Object.entries(allPlayers)
      .sort(([, a], [, b]) => a.level - b.level)
      .map(([username, { level }]) => `${username} -- level: ${level}`);

    performBotAction(() =>
      bot.sendMessage(
        chatId,
        `Всього відомих гравців ${users.length}: \n${users.join("\n")}`,
      ),
    );
  });
