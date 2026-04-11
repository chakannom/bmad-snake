export type SnakeEventName =
  | 'snake_session_start'
  | 'snake_session_end'
  | 'snake_stage_enter'
  | 'snake_stage_clear'
  | 'snake_stage_fail'
  | 'snake_stage_retry'

export interface SnakeEventPayload {
  snake_session_id: number
  snake_stage_id?: string
  snake_result?: 'clear' | 'fail_collision' | 'fail_timeout'
  snake_elapsed_ms?: number
  snake_platform?: 'pc' | 'mobile'
}

export interface SnakeEvent {
  name: SnakeEventName
  payload: SnakeEventPayload
}
