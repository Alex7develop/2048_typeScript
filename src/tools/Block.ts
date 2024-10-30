import {v4 as uuidv4} from 'uuid';

class Block implements BlockType {
  public uuid: string;
  // public coords: Coords = { x: 0, y: 0 };
  public value: number;

  constructor(value: number) {
    this.uuid = uuidv4();
    // x: number, y: number, 
    // this.coords.x = x;
    // this.coords.y = y;
    this.value = value;
  }
}

export default Block;
