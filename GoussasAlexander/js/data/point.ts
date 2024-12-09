export interface Point {
  x: number;
  y: number;
}

export const mkPoint = (x: number, y: number): Point => ({ x, y });

export const add = (a: Point, b: Point): Point => mkPoint(a.x + b.x, a.y + b.y);

export const equals = (a: Point, b: Point): boolean =>
  a.x === b.x && a.y === b.y;

export const toCompactString = (p: Point): string => `${p.x},${p.y}`;
export const fromCompactString = (s: string): Point => {
  const [x, y] = s.split(",").map(Number);
  return mkPoint(x, y);
};
