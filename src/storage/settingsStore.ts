export type Settings = {
  touchControlsEnabled: boolean;
};

const KEY = 'bmad-snake-settings-v1';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { touchControlsEnabled: true };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { touchControlsEnabled: parsed.touchControlsEnabled ?? true };
  } catch {
    return { touchControlsEnabled: true };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
