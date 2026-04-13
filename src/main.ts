import './style.css';
import { GameEngine } from './game/GameEngine';
import { createAppShell } from './ui/Controls';
import { applyTheme } from './ui/Theme';
import { loadSettings, saveSettings } from './storage/settingsStore';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

applyTheme();
const settings = loadSettings();

const refs = createAppShell(app);
const game = new GameEngine(app, refs, settings, (next) => saveSettings(next));

window.addEventListener('beforeunload', () => game.dispose());
