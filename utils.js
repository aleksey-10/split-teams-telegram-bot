/**
 *
 * @param {Pick<import("@prisma/client").User, 'firstName' | 'lastName' | 'username'>} user
 */
export function getUserName(user) {
  const fullName = `${user.firstName}${
    user.lastName ? ' ' + user.lastName : ''
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
