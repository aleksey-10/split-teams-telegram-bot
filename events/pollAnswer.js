import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';
import { upsertUserChat } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onPollAnswer = (bot, prisma) =>
  bot.on('poll_answer', async pollAnswer => {
    const { poll_id, user: telegramUser } = pollAnswer;

    // check if there is such user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            telegramUserId: pollAnswer.user.id,
          },
          {
            username: telegramUser.username,
          },
        ],
      },
    });

    // if no then create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: telegramUser.first_name,
          telegramUserId: telegramUser.id,
          lastName: telegramUser.last_name,
          level: 0,
          username: telegramUser.username,
        },
      });
    } else {
      if (!user.telegramUserId && user.username) {
        await prisma.user.update({
          where: { username: user.username },
          data: { telegramUserId: telegramUser.id },
        });
      }
    }

    const [optionId = -1] = pollAnswer.option_ids;

    // create or update a record in pollResults
    let pollResult = await prisma.pollResults.findFirst({
      where: { pollId: poll_id, userId: user.id },
    });

    if (pollResult) {
      await prisma.pollResults.update({
        where: { id: pollResult.id },
        data: { optionId },
      });
    } else {
      await prisma.pollResults.create({
        data: {
          pollId: poll_id,
          optionId,
          userId: user.id,
        },
      });
    }

    const { chatId } = await prisma.pollChatId.findFirstOrThrow({ where: { pollId: poll_id }});
    console.log("🚀 ~ chatId:", chatId)

    upsertUserChat(prisma, { chatId, userId: user.id });
  });
