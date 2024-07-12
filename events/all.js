import { PrismaClient } from '@prisma/client';
import { getUserName, performBotAction } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onAll = (bot, prisma) =>
  bot.onText(/\/all/, async msg => {
    const chatId = msg.chat.id;

    //const users = Object.entries(allPlayers)
    //  .sort(([, a], [, b]) => a.level - b.level)
    //  .map(([username, { level }]) => `${username} -- level: ${level}`);

    const users = await prisma.user.findMany();

    performBotAction(() =>
      bot.sendMessage(
        chatId,
        `Всього відомо ${users.length} гравців: \n${users
          .map(user => `${getUserName(user)} -- level ${user.level}`)
          .join('\n')}`
      )
    );
  });
