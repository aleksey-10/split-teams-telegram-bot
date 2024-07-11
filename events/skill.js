import { allPlayers } from '../index.js';
import { getUserName, performBotAction } from '../utils.js';
import fs from 'fs';

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
 */
export const onCallbackQuery = bot =>
  bot.on('callback_query', callbackQuery => {
    const message = callbackQuery.message;
    const choice = callbackQuery.data;
    const username = getUserName(callbackQuery.from);

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

    allPlayers[username] = { level: levels[choice] };

    console.log('🚀 ~ allPlayers:', allPlayers);

    //const filename = 'data.txt'; // Replace with your file name
    //const dataToAppend = `${username} -- ${choice}\n`; // Data to append

    //// Append data to a file
    //fs.appendFile(filename, dataToAppend, err => {
    //  if (err) {
    //    console.error('Error appending data:', err);
    //    return;
    //  }
    //  console.log('Data appended successfully!');
    //});

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
