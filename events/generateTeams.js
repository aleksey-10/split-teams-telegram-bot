import { PrismaClient } from '@prisma/client';
import { getUserName, performBotAction } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 * @param {PrismaClient} prisma
 */
export const onGenerateTeams = (bot, prisma) =>
  bot.onText(/\/generateteams (\d+)/, async (msg, [, numberOfTeams]) => {
    const chatId = msg.chat.id;

    const { pollId } = await prisma.pollChatId.findFirstOrThrow({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });

    const activePlayers = await prisma.pollResults.findMany({
      where: { pollId },
      select: { user: true },
    });

    try {
      const teams = generateBalancedTeams(
        activePlayers.map(({ user }) => user),
        numberOfTeams
      );

      teams.forEach((team, index) =>
        performBotAction(() =>
          bot.sendMessage(
            chatId,
            `Team ${index + 1} (кількість ${team.length}): ${team.join(', ')}`
          )
        )
      );
    } catch (e) {
      console.error(e);
    }
  });

/**
 *
 * @param {import('@prisma/client').User[]} activePlayers
 * @param {number} numberOfTeams
 */
function generateBalancedTeams(activePlayers = [], numberOfTeams = 2) {
  console.log('🚀 ~ generateBalancedTeams ~ activePlayers:', activePlayers);
  // Initialize teams as empty arrays
  let teams = Array.from({ length: numberOfTeams }, () => []);

  // Sort players by strength category
  activePlayers.sort((a, b) => a.level - b.level);

  // Shuffle players within each category
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  /**
   * @type {import('@prisma/client').User[]}
   */
  const categories = [[], [], []];
  activePlayers.forEach(player => {
    categories[player.level].push(player);
  });

  categories.forEach(category => shuffleArray(category));

  // Re-merge shuffled categories into a single array
  const shuffledPlayers = categories.flat();

  // Distribute players to teams
  shuffledPlayers.forEach((player, index) => {
    teams[index % numberOfTeams].push(
      '\n@' + getUserName(player) + ' level:' + (player.level || 0)
    );
  });

  return teams;
}
