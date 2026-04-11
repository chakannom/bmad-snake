import type { Point } from '../game/types'

interface PlayfieldProps {
  cols: number
  rows: number
  head: Point
  onTouchStart: (x: number, y: number) => void
  onTouchEnd: (x: number, y: number) => void
}

export function Playfield({
  cols,
  rows,
  head,
  onTouchStart,
  onTouchEnd,
}: PlayfieldProps) {
  const cells = []

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const active = x === head.x && y === head.y
      cells.push(
        <div
          key={`${x}-${y}`}
          className={active ? 'cell cell--active' : 'cell'}
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
