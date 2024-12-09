import { makeADT, ofType } from "@morphic-ts/adt";
import { mkPoint, type Point } from "./data/point";
import type { Direction } from "./data/direction";
import * as direction from "./data/direction";
import * as point from "./data/point";

type Guard = {
  _tag: "guard";
  sprite: "^";
  direction: Direction;
  position: Point;
};
type Obstacle = { _tag: "obstacle"; sprite: "#" };
type Floor = { _tag: "floor"; sprite: "." };

const Cell = makeADT("_tag")({
  obstacle: ofType<Obstacle>(),
  floor: ofType<Floor>(),
});

type Cell = Obstacle | Floor;

type M = {
  guard: Guard;
  cells: Cell[][];
};

const parse = (input: string): M => {
  let guard: Guard = {
    _tag: "guard",
    sprite: "^",
    direction: "N",
    position: mkPoint(0, 0),
  };
  const cells = input
    .trim()
    .split(/\r?\n/)
    .map((line, i) =>
      line.split("").map((c, j) => {
        switch (c) {
          case "^":
            guard.position = mkPoint(i, j);
            return Cell.of.floor({ sprite: "." });
          case "#":
            return Cell.of.obstacle({ sprite: c });
          case ".":
            return Cell.of.floor({ sprite: c });
          default:
            throw new Error(`Unknown cell type: ${c}`);
        }
      }),
    );
  return {
    guard,
    cells,
  };
};

const drawMap = (m: M, visited: Set<string>) => {
  const { guard, cells } = m;
  const map = cells.map((row, i) =>
    row.map((cell, j) => {
      const p = mkPoint(i, j);
      if (point.equals(guard.position, p)) {
        return guard.sprite;
      } else if (visited.has(point.toCompactString(p))) {
        return "X";
      } else {
        return cell.sprite;
      }
    }),
  );
  return map.map((row) => row.join("")).join("\n");
};

export const part1 = (input: string) => {
  const { guard, cells } = parse(input);
  const visited = new Set<string>();

  while (
    guard.position.x > 0 &&
    guard.position.x < cells.length - 1 &&
    guard.position.y > 0 &&
    guard.position.y < cells[0].length - 1
  ) {
    const d = direction.vector(guard.direction);
    const p = point.add(guard.position, d);

    visited.add(point.toCompactString(guard.position));

    Cell.matchStrict({
      floor: () => {
        guard.position = p;
      },
      obstacle: () => {
        guard.direction = direction.turnRight(guard.direction);
      },
    })(cells[p.x][p.y]);
  }

  return visited.size + 1;
};

export const part2 = (input: string) => {};

if (import.meta.path == Bun.main) {
  const input = await Bun.file("input.txt").text();
  console.log(`Part one: ${part1(input)}`);
  console.log(`Part two: ${part2(input)}`);
}
