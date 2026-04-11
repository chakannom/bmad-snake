import { resolveNextDirection } from './inputPolicy'
import type { Direction, GameOverReason, Point, StageDefinition } from './types'

export interface SnakeGameState {
  mode: 'playing' | 'failed' | 'cleared'
  reason: GameOverReason
  cols: number
  rows: number
  snake: Point[]
  direction: Direction
  food: Point
  foodEaten: number
  goalFood: number
  elapsedMs: number
  timeLimitSec: number
}

const START_SNAKE: Point[] = [
  { x: 3, y: 4 },
  { x: 2, y: 4 },
  { x: 1, y: 4 },
]

function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

function pointKey(point: Point): string {
  return `${point.x}:${point.y}`
}

export function spawnFood(
  snake: Point[],
  cols: number,
  rows: number,
  rndInt = randomInt,
): Point {
  const occupied = new Set(snake.map(pointKey))
  const all: Point[] = []

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!occupied.has(`${x}:${y}`)) {
        all.push({ x, y })
      }
    }
  }

  if (all.length === 0) {
    return snake[0]
  }

  return all[rndInt(all.length)]
}

export function createInitialGame(stage: StageDefinition): SnakeGameState {
  return {
    mode: 'playing',
    reason: 'none',
    cols: stage.width,
    rows: stage.height,
    snake: START_SNAKE,
    direction: 'right',
    food: spawnFood(START_SNAKE, stage.width, stage.height),
    foodEaten: 0,
    goalFood: stage.goalFood,
    elapsedMs: 0,
    timeLimitSec: stage.timeLimitSec,
  }
}

function collidesWithBody(head: Point, body: Point[]): boolean {
  return body.some((segment) => segment.x === head.x && segment.y === head.y)
}

function nextHead(head: Point, direction: Direction): Point {
  if (direction === 'up') {
    return { x: head.x, y: head.y - 1 }
  }

  if (direction === 'down') {
    return { x: head.x, y: head.y + 1 }
  }

  if (direction === 'left') {
    return { x: head.x - 1, y: head.y }
  }

  return { x: head.x + 1, y: head.y }
}

function isOutOfBounds(head: Point, cols: number, rows: number): boolean {
  return head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows
}

export function updateDirection(
  prev: SnakeGameState,
  candidate: Direction,
): SnakeGameState {
  if (prev.mode !== 'playing') {
    return prev
  }

  return {
    ...prev,
    direction: resolveNextDirection(prev.direction, candidate),
  }
}

export function tick(state: SnakeGameState, deltaMs: number): SnakeGameState {
  if (state.mode !== 'playing') {
    return state
  }

  const elapsedMs = state.elapsedMs + deltaMs

  if (elapsedMs >= state.timeLimitSec * 1000) {
    return {
      ...state,
      elapsedMs,
      mode: 'failed',
      reason: 'timeout',
    }
  }

  const head = nextHead(state.snake[0], state.direction)

  if (isOutOfBounds(head, state.cols, state.rows) || collidesWithBody(head, state.snake)) {
    return {
      ...state,
      elapsedMs,
      mode: 'failed',
      reason: 'collision',
    }
  }

  const ateFood = head.x === state.food.x && head.y === state.food.y
  const grownSnake = ateFood
    ? [head, ...state.snake]
    : [head, ...state.snake.slice(0, state.snake.length - 1)]

  const foodEaten = ateFood ? state.foodEaten + 1 : state.foodEaten

  if (foodEaten >= state.goalFood) {
    return {
      ...state,
      snake: grownSnake,
      foodEaten,
      elapsedMs,
      mode: 'cleared',
      reason: 'cleared',
    }
  }

  return {
    ...state,
    snake: grownSnake,
    food: ateFood ? spawnFood(grownSnake, state.cols, state.rows) : state.food,
    foodEaten,
    elapsedMs,
  }
}
