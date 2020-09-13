import { Cell } from "./Cell";
import { Configuration } from "./Configuration";

export class Grid {
  private configuration: Configuration;
  apples: Cell[] = [
    new Cell(33, 22),
    new Cell(35, 22),
    new Cell(37, 22),
    new Cell(39, 22),
    new Cell(41, 22)
  ];

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  getRndInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  seed(): void {
    this.apples = [
      new Cell( this.getRndInteger( 0 , 80 ), this.getRndInteger( 0 , 40 ) ),
      new Cell( this.getRndInteger( 0 , 80 ), this.getRndInteger( 0 , 40 ) ),
      new Cell( this.getRndInteger( 0 , 80 ), this.getRndInteger( 0 , 40 ) ),
      new Cell( this.getRndInteger( 0 , 80 ), this.getRndInteger( 0 , 40 ) ),
      new Cell( this.getRndInteger( 0 , 80 ), this.getRndInteger( 0 , 40 ) )
    ];
  }

  isAppleInside(cell: Cell): boolean {
    if ( this.apples.find( el => el.x === cell.x && el.y === cell.y ) !== undefined ) {
      this.removeApple( cell )
      //console.log(cell)
      return true
    } else {
      return false
    }
  }

  removeApple(cell: Cell): void {
    const remove = this.apples.filter( el => el.x === cell.x && el.y === cell.y )

    const index = this.apples.indexOf( remove[0] );

    if ( index > -1 ) {
      this.apples.splice( index, 1 );
    }
  }

  isDone(): boolean {
    if ( this.apples.length === 0 ) this.seed()
    return false;
  }

  getApples(): Cell[] {
    return this.apples
  }
}
