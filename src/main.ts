import './style.css';
import { GameEngine } from './game/GameEngine';
import { applyTheme } from './ui/Theme';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Cannot find #app');

applyTheme();
const engine = new GameEngine(app);

window.addEventListener('beforeunload', () => engine.dispose());
