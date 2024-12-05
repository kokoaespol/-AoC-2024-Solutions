import { FixedIntBuffer } from "./data/fixedIntBuffer";
import type { Iterate } from "./data/iterate";

const valid = (xs: Iterate<number, number>): number => {
  const signum = (x: number) => (x > 0 ? 1 : -1);
  return xs.iterate(({ step }) => {
    let prev = step();
    let cur = step();
    let previous;

    while (cur !== null && prev !== null) {
      previous = cur - prev;

      if (Math.abs(previous) < 1 || Math.abs(previous) > 3) {
        return 0;
      }

      prev = cur;
      cur = step();

      if (cur === null) {
        break;
      }

      const current = cur - prev;
      if (current == 0 || signum(current) != signum(previous)) {
        return 0;
      }

      previous = current;
    }

    if (previous && (Math.abs(previous) < 1 || Math.abs(previous) > 3)) {
      return 0;
    }

    return 1;
  });
};

const input = await Bun.file("input.txt").text();

const levels = input
  .split("\n")
  .filter((line) => line.length !== 0)
  .map((level) => level.split(" ").map(Number))
  .map(FixedIntBuffer.from);

const part1 = levels.reduce((acc, x) => acc + valid(x), 0);

const part2 = levels.reduce((acc, x) => {
  let r = valid(x);
  let i = 0;
  while (r == 0 && i < x.length) {
    x.mask(i);
    r = valid(x);
    x.unmask(i);
    i++;
  }
  return acc + r;
}, 0);

console.log(`Part one: ${part1}`);
console.log(`Part two: ${part2}`);
