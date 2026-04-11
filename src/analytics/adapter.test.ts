import { describe, expect, it } from 'vitest'
import { createGa4Adapter, eventLog } from './adapter'

describe('analytics adapter', () => {
  it('records event to local log even without gtag', () => {
    const adapter = createGa4Adapter()

    adapter.track({
      name: 'snake_session_start',
      payload: {
        snake_session_id: 1,
        snake_platform: 'pc',
      },
    })

    expect(eventLog.at(-1)?.name).toBe('snake_session_start')
  })
})
