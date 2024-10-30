import Block from "./Block";

class Game {
  public state: GameState = [];
  public merges = new Map<string, string>();

  public constructor(public length: number) {
    for (let i = 0; i < length; i++) {
      const row = Array.from({ length }).fill(null) as (BlockType|null)[];
      this.state.push(row);
    }
    this.placeRandomBlock();
    this.placeRandomBlock();
  }

  public getEmptyCells(): Coords[] {
    const { state } = this;
    const emptyCells: Coords[] = [];
    for (let x = 0; x < state.length; x++) 
      for (let y = 0; y < state[x].length; y++)
        if (state[x][y] === null) emptyCells.push({ x, y });
    return emptyCells;
  }

  public placeRandomBlock(): void {
    const emptyCells = this.getEmptyCells();
    const index = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[index];
    const value = Game.twoOrFour();
    this.state[cell.x][cell.y] = new Block(value);
  }

  private static twoOrFour(): 2 | 4 {
    return Math.random() < 0.2 ? 4 : 2;
  }

  public hasAvailableTurns(): boolean {
    return true;
  }

  public handleMove(key: ControlKey) {
    const { state: origin, merges, length } = this;
    merges.clear();
    let state = structuredClone(origin);
    if (key === 'ArrowLeft') {
      state.forEach((row, y) => {
        const filtered = row.filter(cell => cell !== null);
        const newRow: (BlockType|null)[] = [];
        for (let i = 0; i < filtered.length; i++) {
          if (filtered[i].value === filtered[i+1]?.value) {
            filtered[i].value = filtered[i].value * 2;
            merges.set(filtered[i+1].uuid, filtered[i].uuid);
            newRow.push(filtered[i]);
            i++;
          }
          else {
            newRow.push(filtered[i]);
          }
        }
        const zeroIndex = newRow.length;
        newRow.length = length;
        newRow.fill(null, zeroIndex);
        state[y] = newRow;
      })
    }
    if (key === 'ArrowRight') {
      state.forEach((row, y) => {
        const filtered = row.filter(cell => cell !== null);
        const newRow: (BlockType|null)[] = [];
        for (let i = filtered.length-1; i >= 0; i--) {
          if (filtered[i].value === filtered[i-1]?.value) {
            filtered[i].value = filtered[i].value * 2;
            merges.set(filtered[i-1].uuid, filtered[i].uuid);
            newRow.unshift(filtered[i]);
            i--;
          }
          else {
            newRow.unshift(filtered[i]);
          }
        }
        while (newRow.length < length) newRow.unshift(null);
        state[y] = newRow;
      })
    }
    if (key === 'ArrowUp') {
      const columns: (BlockType|null)[][] = Game.rowsToCols(state);
      columns.forEach((col, x) => {
        const filtered = col.filter(cell => cell !== null);
        const newCol: (BlockType|null)[] = [];
        for (let i = 0; i < filtered.length; i++) {
          if (filtered[i].value === filtered[i+1]?.value) {
            filtered[i].value = filtered[i].value * 2;
            merges.set(filtered[i+1].uuid, filtered[i].uuid);
            newCol.push(filtered[i]);
            i++;
          }
          else {
            newCol.push(filtered[i]);
          }
        }
        while (newCol.length < length) newCol.push(null);
        columns[x] = newCol;
      });
      state = Game.colsToRows(columns);
    }
    if (key === 'ArrowDown') {
      const columns: (BlockType|null)[][] = Game.rowsToCols(state);
      columns.forEach((col, x) => {
        const filtered = col.filter(cell => cell !== null);
        const newCol: (BlockType|null)[] = [];
        for (let i = filtered.length-1; i >= 0; i--) {
          if (filtered[i].value === filtered[i-1]?.value) {
            filtered[i].value = filtered[i].value * 2;
            merges.set(filtered[i-1].uuid, filtered[i].uuid);
            newCol.unshift(filtered[i]);
            i--;
          }
          else {
            newCol.unshift(filtered[i]);
          }
        }
        while (newCol.length < length) newCol.unshift(null);
        columns[x] = newCol;
      });
      state = Game.colsToRows(columns);
    }
    if (JSON.stringify(state) === JSON.stringify(origin)) return origin;
    Object.assign(this, { state });
    this.placeRandomBlock();
    return state;
  }

  public static rowsToCols(rows: (BlockType|null)[][]): (BlockType|null)[][] {
    const cols: (BlockType|null)[][] = [];
    for (let i = 0; i < rows.length; i++) {
      const col: (BlockType|null)[] = []
      rows.forEach(row => col.push(row[i]));
      cols[i] = col;
    }
    return cols;
  }

  public static colsToRows(cols: (BlockType|null)[][]): (BlockType|null)[][] {
    const rows: (BlockType|null)[][] = [];
    for (let i = 0; i < cols.length; i++) {
      const row: (BlockType|null)[] = [];
      cols.forEach(col => row.push(col[i]));
      rows[i] = row;
    }
    return rows;
  }
}

export default Game;

