import type { Point } from "./point";

export function neighbors<T>({
  of,
  neighborhood,
  diagonals = false,
}: {
  of: Point;
  neighborhood: T[][];
  diagonals?: boolean;
}): Point[] {
  const points = [];
  const { x, y } = of;

  if (x > 0) points.push({ x: x - 1, y });
  if (x < neighborhood.length - 1) points.push({ x: x + 1, y });
  if (y > 0) points.push({ x, y: y - 1 });
  if (y < neighborhood[x].length - 1) points.push({ x, y: y + 1 });

  if (diagonals) {
    if (x > 0 && y > 0) points.push({ x: x - 1, y: y - 1 });
    if (x > 0 && y < neighborhood[x].length - 1)
      points.push({ x: x - 1, y: y + 1 });
    if (x < neighborhood.length - 1 && y > 0)
      points.push({ x: x + 1, y: y - 1 });
    if (x < neighborhood.length - 1 && y < neighborhood[x].length - 1)
      points.push({ x: x + 1, y: y + 1 });
  }

  return points;
}
