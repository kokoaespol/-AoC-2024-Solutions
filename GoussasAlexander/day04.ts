import { neighbors } from "./data/arrayUtils";
import {
  getDirection,
  isDiagonal,
  ne,
  nw,
  se,
  sw,
  type Direction,
} from "./data/direction";
import type { Point } from "./data/point";

const input = await Bun.file("input.txt").text();

const graph = input
  .split("\n")
  .filter((line) => line.length > 0)
  .map((line) => line.split(""));

type Item = {
  value: string;
  x: number;
  y: number;
  comingFrom: Direction | undefined;
};

const dfs = (from: Point, xs: string[][]): number => {
  const root: Item = {
    value: xs[from.x][from.y],
    x: from.x,
    y: from.y,
    comingFrom: undefined,
  };

  const stack = [root];
  let count = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;
    const curPos = { x: current.x, y: current.y };

    if (current.value.length >= 4) {
      if (current.value === "XMAS") {
        count += 1;
      }
      continue;
    }

    for (const newPos of neighbors({
      of: curPos,
      neighborhood: xs,
      diagonals: true,
    })) {
      const direction = getDirection(curPos, newPos);

      if (
        current.comingFrom !== undefined &&
        current.comingFrom !== direction
      ) {
        continue;
      }

      stack.push({
        value: current.value + xs[newPos.x][newPos.y],
        x: newPos.x,
        y: newPos.y,
        comingFrom: direction,
      });
    }
  }

  return count;
};

const part1 = () => {
  let sum = 0;
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      if (graph[i][j] == "X") {
        sum += dfs({ x: i, y: j }, graph);
      }
    }
  }
  return sum;
};

const part2 = () => {
  let sum = 0;
  for (let i = 1; i < graph.length - 1; i++) {
    for (let j = 1; j < graph[i].length - 1; j++) {
      if (graph[i][j] == "A") {
        const nw = graph[i - 1][j - 1];
        const ne = graph[i - 1][j + 1];
        const se = graph[i + 1][j + 1];
        const sw = graph[i + 1][j - 1];

        if (
          new Set([nw, ne, se, sw]).intersection(new Set(["M", "S"])).size !== 2
        ) {
          continue;
        }

        if ((nw == ne && se == sw) || (nw == sw && ne == se)) {
          sum += 1;
        }
      }
    }
  }
  return sum;
};

console.log(`Part one: ${part1()}`);
console.log(`Part two: ${part2()}`);
