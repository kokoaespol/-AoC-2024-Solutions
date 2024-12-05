import _ from "lodash";

type G = Map<string, Set<string>>;

const mkGraph = (instructions: string[][]): G => {
  const g = new Map();
  for (const [from, to] of instructions) {
    if (g.has(to)) {
      g.set(to, g.get(to).add(from));
    } else {
      g.set(to, new Set([from]));
    }
  }
  return g;
};

const input = await Bun.file("sample.txt").text();

const [instructions, updates] = input.trim().split("\n\n");

const g = mkGraph(instructions.split("\n").map((i) => i.split("|")));
const u = updates.split("\n").map((u) => u.split(","));

const isSorted = (xs: string[]) => {
  let i = 1;
  let previous = xs[i - 1];
  while (i < xs.length) {
    if (!g.get(xs[i])?.has(previous)) break;
    previous = xs[i];
    i++;
  }
  return i >= xs.length;
};

const sort = (xs: string[], g: G) => {};

const part1 = () => {
  let sum = 0;
  for (const update of u) {
    if (isSorted(update)) {
      sum += Number(update[Math.floor(update.length / 2)]);
    }
  }
  return sum;
};

const part2 = () => {
  let sum = 0;
  for (const update of u) {
    if (!isSorted(update)) {
      const sorted = sort(update, g);
      console.log(sorted);
      sum += Number(update[Math.floor(update.length / 2)]);
    }
  }
  return sum;
};

console.log(`Part one: ${part1()}`);
console.log(`Part two: ${part2()}`);
