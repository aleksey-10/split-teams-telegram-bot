/**
 *
 * @param {Pick<import("@prisma/client").User, 'firstName' | 'lastName' | 'username'>} user
 */
export function getUserName(user) {
  const fullName = user.firstName
    ? `${user.firstName?.trim()}${
        user.lastName?.trim() ? ' ' + user.lastName?.trim() : ''
      }`
    : '';

  let username = user.username || fullName;

  if (user.username && fullName) {
    username = `${user.username} (${fullName.trim()})`;
  }

  return username;
}

/**
 *
 * @param {() => void} cb
 */
export function performBotAction(cb) {
  setTimeout(cb, 500);
}
