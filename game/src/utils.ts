export function limit(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function intersectArea(a: Area, b: Area): boolean {
  return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
}
