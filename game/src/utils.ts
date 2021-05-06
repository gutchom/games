import { CommonArea, CommonOffset } from '@akashic/akashic-engine'

export function limit(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

export function intersectArea(a: CommonArea, b: CommonArea): boolean {
  return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
}

export function intersect(point: CommonOffset, area: CommonArea): boolean {
  return point.x >= area.x && point.x <= area.x + area.width && point.y >= area.y && point.y <= area.y + area.height;
}
