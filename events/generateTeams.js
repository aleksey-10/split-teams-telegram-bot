import { allPlayers, pollResults } from '../index.js';
import { performBotAction } from '../utils.js';

/**
 *
 * @param {TelegramBot} bot
 */
export const onGenerateTeams = bot =>
  bot.onText(/\/generateteams (\d+)/, (msg, [, numberOfTeams]) => {
    const chatId = msg.chat.id;

    const people = Object.entries(pollResults[chatId])
      .filter(([, option]) => option === 0)
      .map(([username]) => username);

    try {
      const teams = generateBalancedTeams(people, numberOfTeams);

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

function generateBalancedTeams(activePlayers, numberOfTeams) {
  const players = [[], [], []];

  Object.entries(allPlayers).forEach(([username, { level }]) =>
    players[level].push(username)
  );

  console.log('🚀 ~ generateBalancedTeams ~ arr:', players);

  // Initialize teams as empty arrays
  let teams = Array.from({ length: numberOfTeams }, () => []);

  // Function to get strength category based on player name
  const getCategoryIndex = (playerName, players) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].includes(playerName)) {
        return i;
      }
    }
    return 0; // Default to low-level if player is not found
  };

  // Filter active players and map each player to their strength category
  const filteredPlayers = activePlayers.map(player => ({
    player,
    category: getCategoryIndex(player, players),
  }));

  // Sort players by strength category
  filteredPlayers.sort((a, b) => a.category - b.category);

  // Shuffle players within each category
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const categories = [[], [], []];
  filteredPlayers.forEach(player => {
    categories[player.category].push(player.player);
  });

  categories.forEach(category => shuffleArray(category));

  // Re-merge shuffled categories into a single array
  const shuffledPlayers = categories.flat();

  // Distribute players to teams
  shuffledPlayers.forEach((player, index) => {
    teams[index % numberOfTeams].push(
      '\n@' + player + ' level:' + (allPlayers[player]?.level || 0)
    );
  });

  return teams;
}
