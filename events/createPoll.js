import { PrismaClient } from '@prisma/client';
import { performBotAction } from '../utils.js';
import TelegramBot from 'node-telegram-bot-api';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onCreatePoll = (bot, prisma) =>
  bot.onText(/\/createpoll (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    const message = match[1];

    performBotAction(() =>
      bot
        .sendPoll(chatId, message, ['+', '-'], {
          is_anonymous: false,
        })
        .then(async ({ poll }) => {
          console.log('🚀 ~ .then ~ chatId:', { chatId, poll });

          await prisma.pollChatId.create({ data: { chatId, pollId: poll.id } });
        })
    );
  });
