import { PrismaClient } from '@prisma/client';
import { getUserName, performBotAction } from '../utils.js';
import TelegramBot from 'node-telegram-bot-api';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onAll = (bot, prisma) =>
  bot.onText(/\/all/, async msg => {
    const chatId = msg.chat.id;

    const users = await prisma.user.findMany({
      where: { UserChat: { some: { chatId } } },
      orderBy: { level: 'asc' },
    });
    console.log("🚀 ~ users:", users)

    /**
     * @type {import('@prisma/client').User[][]}
     */
    const formattedUsers = users
      .reduce((acc, user) => {
        console.log('🚀 ~ formattedUsers ~ acc, user:', { acc, user });
        if (!acc[user.level]) {
          acc[user.level] = [];
        }

        acc[user.level].push(user);

        return acc;
      }, [])
      .reverse();

    performBotAction(() =>
      bot.sendMessage(
        chatId,
        `<strong><u>${users.length} гравців:</u></strong> \n${formattedUsers
          .map((usersGroup, index, list) => {
            return `\n<strong>level ${list.length - index - 1} (${
              usersGroup.length
            } гравців)</strong>${usersGroup
              .map(user => `\n- ${getUserName(user)}`)
              .join('')}`;
          })
          .join('\n')}`,
        {
          parse_mode: 'HTML',
        }
      )
    );
  });
