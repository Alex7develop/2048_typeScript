type Coords = {
  x: number;
  y: number;
}
type BlockType = {
  uuid: string;
  value: number;
}
type GameState = (BlockType|null)[][];
// type Direction = 'left' | 'right' | 'up' | 'down';
type ControlKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';
