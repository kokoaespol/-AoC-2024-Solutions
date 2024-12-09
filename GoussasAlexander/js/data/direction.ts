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

export const vector = (direction: Direction): Point => {
  switch (direction) {
    case "N":
      return { x: -1, y: 0 };
    case "S":
      return { x: 1, y: 0 };
    case "E":
      return { x: 0, y: 1 };
    case "W":
      return { x: 0, y: -1 };
    case "NE":
      return { x: -1, y: 1 };
    case "NW":
      return { x: -1, y: -1 };
    case "SE":
      return { x: 1, y: 1 };
    case "SW":
      return { x: 1, y: -1 };
  }
};

export const turnRight = (direction: Direction): Direction => {
  switch (direction) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
    case "NE":
      return "SE";
    case "SE":
      return "SW";
    case "SW":
      return "NW";
    case "NW":
      return "NE";
  }
};
