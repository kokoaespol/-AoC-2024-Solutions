import { FixedIntBuffer } from "./data/fixedIntBuffer";

const valid = (xs: FixedIntBuffer): number => {
  const signum = (x: number) => (x > 0 ? 1 : -1);
  let previous = xs.at(1) - xs.at(0);

  for (let i = 2; i < xs.length; i++) {
    if (Math.abs(previous) < 1 || Math.abs(previous) > 3) {
      return 0;
    }

    const current = xs.at(i) - xs.at(i - 1);
    if (current == 0 || signum(current) != signum(previous)) {
      return 0;
    }

    previous = current;
  }

  if (Math.abs(previous) < 1 || Math.abs(previous) > 3) {
    return 0;
  }

  return 1;
};

const input = await Bun.file("input.txt").text();

const levels = input
  .split("\n")
  .filter((line) => line.length !== 0)
  .map((level) => level.split(" ").map(Number))
  .map(FixedIntBuffer.from);

const part1 = levels.reduce((acc, x) => acc + valid(x), 0);

console.log(`Part one: ${part1}`);
