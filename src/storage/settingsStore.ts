export type Settings = {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  touchSize: 'md' | 'lg';
};

const SETTINGS_KEY = 'bmad-snake-settings-v1';

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: false,
  hapticEnabled: false,
  touchSize: 'md',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
