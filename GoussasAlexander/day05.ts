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

const input = await Bun.file("input.txt").text();

const [instructions, updates] = input.trim().split("\r\n\r\n");

const g = mkGraph(instructions.split("\r\n").map((i) => i.split("|")));
const u = updates.split("\r\n").map((u) => u.split(","));

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

const sort = (xs: string[], g: G) => {
  const visited = new Set();
  const path = [] as string[];

  const visit = (node: string) => {
    if (visited.has(node)) {
      return true;
    }

    visited.add(node);

    for (const x of g.get(node) ?? []) {
      if (xs.includes(x)) {
        visit(x);
      }
    }

    path.push(node);
  };

  for (const x of xs) {
    if (!visited.has(x)) {
      if (visit(x)) {
        break;
      }
    }
  }

  return path;
};

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
      sum += Number(sorted[Math.floor(update.length / 2)]);
    }
  }
  return sum;
};

console.log(`Part one: ${part1()}`);
console.log(`Part two: ${part2()}`);
