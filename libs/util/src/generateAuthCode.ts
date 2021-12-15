export function generateAuthCode(): string {
  const MIN = 100000;
  const MAX = 999999;

  return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString();
}
