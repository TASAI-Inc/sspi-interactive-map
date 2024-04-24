import './map.css'
import { InteractiveMap } from './interactive-map.ts';

window.addEventListener('DOMContentLoaded', async () => {
  const map: InteractiveMap = new InteractiveMap(document.getElementById('js-interactive-map') as HTMLElement);
  await map.init();
});
