export function randomNumberGen(min: number, max: number) {
  const value = Math.floor(Math.random() * (max - min + 1) + min);
  return value;
}
