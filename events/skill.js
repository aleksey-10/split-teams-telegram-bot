import { PrismaClient } from '@prisma/client';
import { getUserName, performBotAction } from '../utils.js';
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

// Listen for /skill command

/**
 *
 * @param {TelegramBot} bot
 */
export const onSkill = bot =>
  bot.onText(/\/skill/, msg => {
    const chatId = msg.chat.id;

    // Define the choices with custom titles
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Середній', callback_data: 'option_low' }],
          [{ text: 'Вище середнього', callback_data: 'option_middle' }],
          [{ text: 'Високий', callback_data: 'option_strong' }],
        ],
      },
    };

    // Send message with choices
    performBotAction(() =>
      bot.sendMessage(chatId, 'Please select your skill level:', options)
    );
  });

// Handle callback queries

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onCallbackQuery = (bot, prisma) =>
  bot.on('callback_query', async callbackQuery => {
    const message = callbackQuery.message;
    const choice = callbackQuery.data;
    const telegramUser = callbackQuery.from;
    const username = getUserName({
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });

    // Check if the callback query is from the same user who sent the original command
    let responseText;

    switch (choice) {
      case 'option_low':
        responseText = `${username} обрав середній рівень`;
        break;
      case 'option_middle':
        responseText = `${username} обрав рівень вище середнього`;
        break;
      case 'option_strong':
        responseText = `${username} обрав високий рівень`;
        break;
      default:
        responseText = 'Unknown option';
    }

    const levels = { option_low: 0, option_middle: 1, option_strong: 2 };

    const user = await prisma.user.findFirst({
      where: { telegramUserId: telegramUser.id },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { level: levels[choice] },
      });
    } else {
      await prisma.user.create({
        data: {
          firstName: telegramUser.first_name,
          telegramUserId: telegramUser.id,
          lastName: telegramUser.last_name,
          level: levels[choice],
          username: telegramUser.username,
        },
      });
    }

    // Acknowledge the callback query to remove the loading state
    bot
      .answerCallbackQuery(callbackQuery.id)
      .then(() => {
        // Send a message based on the choice
        performBotAction(() => bot.sendMessage(message.chat.id, responseText));
      })
      .catch(error => {
        console.error('Error in answerCallbackQuery:', error);
      });
  });
