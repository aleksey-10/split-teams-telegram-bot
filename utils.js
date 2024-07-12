/**
 *
 * @param {Pick<import("@prisma/client").User, 'firstName' | 'lastName' | 'username'>} user
 */
export function getUserName(user) {
  const fullName = `${user.firstName}${
    user.lastName?.trim() ? ' ' + user.lastName?.trim() : ''
  }`;

  const username = user.username
    ? `${user.username} (${fullName?.trim()})`
    : fullName?.trim();

  return username;
}

/**
 *
 * @param {() => void} cb
 */
export function performBotAction(cb) {
  setTimeout(cb, 500);
}
