export type DiagnosticLevel = 'info' | 'warn' | 'error'

export interface DiagnosticLog {
  level: DiagnosticLevel
  code: string
  message: string
  meta?: Record<string, string | number | boolean>
  ts: string
}

const logs: DiagnosticLog[] = []

export function writeLog(
  level: DiagnosticLevel,
  code: string,
  message: string,
  meta?: DiagnosticLog['meta'],
): void {
  logs.push({
    level,
    code,
    message,
    meta,
    ts: new Date().toISOString(),
  })
}

export function readLogs(): DiagnosticLog[] {
  return logs
}
