import "./style.css";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const BOARD_SIZE = 20;
const CELL = 20;
const TICK_MS = 120;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Cannot find #app");

app.innerHTML = `
  <main class="layout">
    <header>
      <h1>BMAD Snake</h1>
      <p>방향키로 이동, 스페이스로 재시작</p>
    </header>
    <section class="hud">
      <span id="score">점수: 0</span>
      <span id="status">상태: 진행중</span>
    </section>
    <canvas id="game" width="${BOARD_SIZE * CELL}" height="${BOARD_SIZE * CELL}"></canvas>
  </main>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const scoreEl = document.querySelector<HTMLSpanElement>("#score");
const statusEl = document.querySelector<HTMLSpanElement>("#status");
if (!canvas || !scoreEl || !statusEl) throw new Error("UI init failed");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas not supported");

let snake: Point[] = [];
let direction: Direction = "right";
let nextDirection: Direction = "right";
let food: Point = { x: 10, y: 10 };
let score = 0;
let isGameOver = false;
let timer: number | null = null;

const randomPoint = (): Point => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE)
});

const equal = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const spawnFood = (): void => {
  let next = randomPoint();
  while (snake.some((segment) => equal(segment, next))) {
    next = randomPoint();
  }
  food = next;
};

const drawCell = (point: Point, color: string): void => {
  ctx.fillStyle = color;
  ctx.fillRect(point.x * CELL, point.y * CELL, CELL - 1, CELL - 1);
};

const render = (): void => {
  ctx.fillStyle = "#151b14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food, "#ff7f11");

  snake.forEach((segment, index) => {
    drawCell(segment, index === 0 ? "#80ed99" : "#57cc99");
  });
};

const step = (): void => {
  if (isGameOver) return;

  direction = nextDirection;
  const head = snake[0];
  const movement: Record<Direction, Point> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const nextHead = {
    x: head.x + movement[direction].x,
    y: head.y + movement[direction].y
  };

  const outOfBounds =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= BOARD_SIZE ||
    nextHead.y >= BOARD_SIZE;
  const hitSelf = snake.some((segment) => equal(segment, nextHead));

  if (outOfBounds || hitSelf) {
    isGameOver = true;
    statusEl.textContent = "상태: 게임 오버";
    render();
    return;
  }

  snake.unshift(nextHead);

  if (equal(nextHead, food)) {
    score += 10;
    scoreEl.textContent = `점수: ${score}`;
    spawnFood();
  } else {
    snake.pop();
  }

  render();
};

const start = (): void => {
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 }
  ];
  direction = "right";
  nextDirection = "right";
  score = 0;
  isGameOver = false;
  scoreEl.textContent = "점수: 0";
  statusEl.textContent = "상태: 진행중";
  spawnFood();
  render();

  if (timer) window.clearInterval(timer);
  timer = window.setInterval(step, TICK_MS);
};

const opposite: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    start();
    return;
  }

  const map: Record<string, Direction> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };
  const next = map[event.code];
  if (!next) return;

  if (opposite[direction] !== next) {
    nextDirection = next;
  }
});

start();

