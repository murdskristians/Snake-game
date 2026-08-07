import {
  Configuration,
  CELLS_HORIZONTAL,
  CELLS_VERTICAL,
  SPEED
} from "./engine/Configuration";
import { Game } from "./engine/Game";

const CELL_SIZE = 20;
const SCALE = 2.0;

class GameUI {
  private canvas: HTMLCanvasElement;
  private game: Game;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.canvas = canvas;
    this.game = game;
    requestAnimationFrame(this.draw.bind(this));

    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    this.registerTouchControls();
    window.focus();
  }

  // A phone has no arrow keys, so without this the game renders but cannot be
  // played at all. Swiping anywhere on the board steers the snake.
  registerTouchControls() {
    const MIN_SWIPE_PX = 24;
    let startX = 0;
    let startY = 0;

    this.canvas.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
        const touch = event.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: true }
    );

    this.canvas.addEventListener(
      "touchend",
      (event: TouchEvent) => {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        // Ignore taps and other incidental contact.
        if (Math.abs(dx) < MIN_SWIPE_PX && Math.abs(dy) < MIN_SWIPE_PX) return;

        const snake = this.game.getSnake();
        // The dominant axis decides, so a slightly diagonal swipe still reads
        // as the direction the player meant.
        if (Math.abs(dx) > Math.abs(dy)) {
          snake.setDirection(dx > 0 ? "Right" : "Left");
        } else {
          snake.setDirection(dy > 0 ? "Down" : "Up");
        }
      },
      { passive: true }
    );
  }

  draw(time: number) {
    const context = this.canvas.getContext("2d")!;
    if (this.game.shouldUpdate(time)) {
      this.drawBackground(context);
      this.drawGrid(context);
      this.drawBrand(context);
      this.drawScore(context);
      this.drawSnake(context);
      this.drawApples(context);
      this.game.update(time);
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  drawBackground(context: CanvasRenderingContext2D) {
    const { width, height } = this.game.getConfiguration();

    context.fillStyle = "#4caf50";
    context.fillRect(0, 0, width, height);
  }

  drawBrand(context: CanvasRenderingContext2D) {
    const { width, height } = this.game.getConfiguration();
    const text = "Kristians";

    // Sizing purely off the height overflowed the board once the grid became
    // square on narrow screens - the word ran off both edges. Measure the text
    // and shrink it until it fits the width, with the height as the ceiling.
    let fontSize = height / 2.5;
    context.font = fontSize + "px Roboto";
    const maxWidth = width * 0.9;
    const measured = context.measureText(text).width;
    if (measured > maxWidth) {
      fontSize = Math.floor(fontSize * (maxWidth / measured));
      context.font = fontSize + "px Roboto";
    }

    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillText(text, width / 2, height / 2);
  }

  drawScore(context: CanvasRenderingContext2D) {
    context.font = 35 * SCALE + "px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillText(game.getScore().toString(), 10 * SCALE, 10 * SCALE);
  }

  drawGrid(context: CanvasRenderingContext2D) {
    const game = this.game;
    const { width, height, cellWidth, cellHeight } = game.getConfiguration();
    const lineWidth = 1 * SCALE;

    context.strokeStyle = "rgba(255,255,255,0.95)";
    context.lineWidth = lineWidth;

    for (let x = 0; x <= width; x += cellWidth) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += cellHeight) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  drawApples(context: CanvasRenderingContext2D) {
    const { cellWidth, cellHeight } = game.getConfiguration();
    const lineWidth = 1 * SCALE;

    context.fillStyle = "#e91e63";
    const apples = game.getGrid().getApples();
    apples.forEach(cell =>
      context.fillRect(
        cellWidth * cell.x + lineWidth,
        cellHeight * cell.y + lineWidth,
        cellWidth - lineWidth * 2,
        cellHeight - lineWidth * 2
      )
    );
  }

  drawSnake(context: CanvasRenderingContext2D) {
    const snake = this.game.getSnake();
    const { cellWidth, cellHeight } = this.game.getConfiguration();
    // head
    const size = (CELL_SIZE * SCALE) / 10;
    const offset = (CELL_SIZE * SCALE) / 3;
    const x = cellWidth * snake.getHead().x;
    const y = cellHeight * snake.getHead().y;
    context.fillStyle = "#111111";
    context.fillRect(x, y, cellWidth, cellHeight);
    // eyes
    switch (snake.getDirection()) {
      case "Up":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
        context.fill();
        break;
      case "Down":
        context.beginPath();
        context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
        context.arc(
          x + 2 * offset,
          y + 2 * offset,
          size,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = "white";
        context.fill();
        break;
      case "Right":
        context.beginPath();
        context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(
          x + 2 * offset,
          y + 2 * offset,
          size,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = "white";
        context.fill();
        break;
      case "Left":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
        context.fill();
        break;
    }
    // tail
    context.fillStyle = "#333333";
    const tail = snake.getTail();
    tail.forEach(cell =>
      context.fillRect(
        cellWidth * cell.x,
        cellHeight * cell.y,
        cellWidth,
        cellHeight
      )
    );
  }

  onKeyDown(event: KeyboardEvent) {
    const snake = this.game.getSnake();
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        snake.setDirection("Up");
        break;
      case "ArrowDown":
        event.preventDefault();
        snake.setDirection("Down");
        break;
      case "ArrowLeft":
        event.preventDefault();
        snake.setDirection("Left");
        break;
      case "ArrowRight":
        event.preventDefault();
        snake.setDirection("Right");
        break;
    }
  }
}

// An 80x40 board squeezed into a phone gives cells under 5px across - visible
// but not really playable, and the 2:1 shape wastes a portrait screen. A
// coarser square grid keeps the cells finger-sized and fills the space.
const NARROW_VIEWPORT_PX = 768;
const MOBILE_CELLS = 30;

const getGridSize = () => {
  const narrow =
    typeof window !== "undefined" && window.innerWidth < NARROW_VIEWPORT_PX;
  return narrow
    ? { x: MOBILE_CELLS, y: MOBILE_CELLS }
    : { x: CELLS_HORIZONTAL, y: CELLS_VERTICAL };
};

const grid = getGridSize();

const createCanvas = (): HTMLCanvasElement => {
  const container = document.getElementById("game")!;
  const canvas = document.createElement("Canvas") as HTMLCanvasElement;
  container.appendChild(canvas);

  // Display size is left to the stylesheet so the board can scale down to the
  // viewport; only the aspect ratio has to follow the grid.
  canvas.style.aspectRatio = grid.x + " / " + grid.y;

  // image buffer size
  canvas.width = grid.x * CELL_SIZE * SCALE;
  canvas.height = grid.y * CELL_SIZE * SCALE;

  return canvas;
};

const createConfiguration = (canvas: HTMLCanvasElement): Configuration => {
  return {
    level: 0,
    speed: SPEED,
    width: canvas.width,
    height: canvas.height,
    nbCellsX: grid.x,
    nbCellsY: grid.y,
    cellWidth: canvas.width / grid.x,
    cellHeight: canvas.height / grid.y,
    apples: 5
  };
};

const canvas = createCanvas();
const configuration = createConfiguration(canvas);
const game = new Game(configuration);

new GameUI(canvas, game);
