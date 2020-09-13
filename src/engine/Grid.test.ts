import { Grid } from "./Grid";
import { Configuration } from "./Configuration";
import { Cell } from "./Cell";


describe("Grid", () => {
  const configuration = {
    level: 0,
    speed: 100,
    width: 1000,
    height: 1000,
    nbCellsX: 100,
    nbCellsY: 100,
    cellWidth: 10,
    cellHeight: 10,
    apples: 5
  } as Configuration;

  it("should have five apples present", () => {
    const grid = new Grid(configuration);

    const apples = grid.getApples();

    expect(apples.length).toBe(5);
  });
  it("should correctly detect apples in cells", () => {
    const grid = new Grid(configuration);

    const apples = grid.getApples();

    expect(grid.isAppleInside( apples[0] )).toBeTruthy();
    expect(grid.isAppleInside( new Cell (9999999, 999999) )).toBeFalsy();
  });
  it("should remove apples", () => {
    const grid = new Grid(configuration);

    const apples = grid.getApples();

    const testApple = apples[0]
    grid.removeApple( testApple )

    expect( grid.isAppleInside( testApple ) ).toBeFalsy();
  });
  it("should seed if there is no apples", () => {
    const grid = new Grid(configuration);

    let apples = grid.getApples();

    grid.removeApple( apples[0] )
    grid.removeApple( apples[0] )
    grid.removeApple( apples[0] )
    grid.removeApple( apples[0] )
    grid.removeApple( apples[0] )
    expect(apples.length).toBe(0);
    
    grid.seed()
    apples = grid.getApples();
    expect(apples.length).toBe(5);
  });
});
