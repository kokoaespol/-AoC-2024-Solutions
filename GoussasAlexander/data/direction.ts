import type { Point } from "./point";

export type Direction = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";

const directions: Record<number, Record<number, Direction>> = {
  0: {
    1: "N",
    [-1]: "S",
  },
  1: {
    0: "E",
    [-1]: "NE",
    1: "SE",
  },
  [-1]: {
    0: "W",
    1: "SW",
    [-1]: "NW",
  },
};

export const getDirection = (from: Point, to: Point): Direction => {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  return directions[dx][dy];
};

export const isDiagonal = (direction: Direction): boolean => {
  return (
    direction === "NE" ||
    direction === "NW" ||
    direction === "SE" ||
    direction === "SW"
  );
};

export const nw = (from: Point): Point => ({ x: from.x - 1, y: from.y - 1 });
export const ne = (from: Point): Point => ({ x: from.x - 1, y: from.y + 1 });
export const sw = (from: Point): Point => ({ x: from.x + 1, y: from.y - 1 });
export const se = (from: Point): Point => ({ x: from.x + 1, y: from.y + 1 });
