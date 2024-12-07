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

const isSorted = (xs: string[], g: G) => {
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

const parse = (input: string): [string[][], G] => {
  const [instructions, updates] = input.trim().split(/\r?\n\r?\n/);
  const g = mkGraph(instructions.split(/\r?\n/).map((i) => i.split("|")));
  const u = updates.split(/\r?\n/).map((u) => u.split(","));
  return [u, g];
};

export const part1 = (input: string) => {
  const [u, g] = parse(input);
  let sum = 0;
  for (const update of u) {
    if (isSorted(update, g)) {
      sum += Number(update[Math.floor(update.length / 2)]);
    }
  }
  return sum;
};

export const part2 = (input: string) => {
  const [u, g] = parse(input);
  let sum = 0;
  for (const update of u) {
    if (!isSorted(update, g)) {
      const sorted = sort(update, g);
      sum += Number(sorted[Math.floor(update.length / 2)]);
    }
  }
  return sum;
};

if (import.meta.path === Bun.main) {
  const input = await Bun.file("input.txt").text();
  console.log(`Part one: ${part1(input)}`);
  console.log(`Part two: ${part2(input)}`);
}
