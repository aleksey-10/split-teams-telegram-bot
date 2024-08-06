import { PrismaClient } from '@prisma/client';
import { performBotAction } from '../utils.js';
import TelegramBot from 'node-telegram-bot-api';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onCreatePoll = (bot, prisma) =>
  bot.onText(/\/poll (.+)/, (msg, [,question]) => {
    const chatId = msg.chat.id;

    performBotAction(() =>
      bot
        .sendPoll(chatId, question, ['+', '-'], {
          is_anonymous: false,
        })
        .then(async ({ poll }) => {
          console.log('🚀 ~ .then ~ chatId:', { chatId, poll });

          await prisma.pollChatId.create({ data: { chatId, pollId: poll.id } });
        })
    );
  });
