export function getUserName(user) {
  const fullName = `${user.first_name}${
    user.last_name ? ' ' + user.last_name : ''
  }`;

  const username = user.username ? `${user.username} (${fullName})` : fullName;

  return username;
}

/**
 *
 * @param {() => void} cb
 */
export function performBotAction(cb) {
  setTimeout(cb, 500);
}
