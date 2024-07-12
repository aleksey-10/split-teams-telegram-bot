import TelegramBot from 'node-telegram-bot-api';
import { getUserName, performBotAction } from '../utils.js';
import { PrismaClient } from '@prisma/client';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onPlayers = (bot, prisma) =>
  bot.onText(/\/players/, async msg => {
    const chatId = msg.chat.id;

    const { pollId } = await prisma.pollChatId.findFirstOrThrow({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });

    const users = await prisma.pollResults.findMany({
      where: { pollId, optionId: 0 },
      select: { user: true },
    });

    performBotAction(() =>
      bot.sendMessage(
        chatId,
        `<strong><u>По останньому голосуванню ${
          users.length
        } плюсів:</u></strong> \n${users
          .map(({ user }) => `- ${getUserName(user)}`)
          .join('\n')}`,
        { parse_mode: 'HTML' }
      )
    );
  });
