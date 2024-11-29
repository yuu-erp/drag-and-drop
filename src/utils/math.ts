export function createGrid(rows: number, columns: number) {
  return Array.from({ length: rows }, (_, y) => Array.from({ length: columns }, (_, x) => ({ x, y }))).flat()
}
