import type { Point } from '../game/types'

interface PlayfieldProps {
  cols: number
  rows: number
  snake: Point[]
  food: Point
  onTouchStart: (x: number, y: number) => void
  onTouchEnd: (x: number, y: number) => void
}

export function Playfield({
  cols,
  rows,
  snake,
  food,
  onTouchStart,
  onTouchEnd,
}: PlayfieldProps) {
  const snakeSet = new Set(snake.map((segment) => `${segment.x}:${segment.y}`))
  const cells = []

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x}:${y}`
      const hasSnake = snakeSet.has(key)
      const hasFood = x === food.x && y === food.y
      const className = hasSnake
        ? 'cell cell--snake'
        : hasFood
          ? 'cell cell--food'
          : 'cell'
      cells.push(
        <div
          key={`${x}-${y}`}
          className={className}
          aria-hidden="true"
        />,
      )
    }
  }

  return (
    <section
      className="playfield"
      aria-label="플레이 영역"
      onTouchStart={(event) => {
        const touch = event.changedTouches[0]
        onTouchStart(touch.clientX, touch.clientY)
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0]
        onTouchEnd(touch.clientX, touch.clientY)
      }}
    >
      <div
        className="playfield__grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {cells}
      </div>
    </section>
  )
}
