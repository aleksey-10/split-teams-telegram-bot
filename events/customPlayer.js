import fs from 'fs';
import { performBotAction, upsertUserChat } from '../utils.js';
import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';
/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onCustomPlayer = (bot, prisma) =>
  bot.onText(/\/customplayer (.+)/, async (msg, [, username]) => {
    const chatId = msg.chat.id;

    const { pollId } = await prisma.pollChatId.findFirstOrThrow({
      where: { chatId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { level: 0, username },
      });
    }

    upsertUserChat(prisma, { chatId, userId: user.id });

    const record = await prisma.pollResults.findFirst({
      where: { AND: [{ userId: user.id }, { pollId }] },
    });

    const hasAlreadyJoined = record?.optionId === 0;

    if (record) {
      await prisma.pollResults.update({
        where: { id: record.id },
        data: { optionId: hasAlreadyJoined ? 1 : 0 },
      });
    } else {
      await prisma.pollResults.create({
        data: {
          user: { connect: { id: user.id } },
          optionId: 0,
          pollChatId: { connect: { pollId } },
        },
      });
    }

    try {
      performBotAction(() =>
        bot.sendMessage(
          chatId,
          `${username} ${
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
