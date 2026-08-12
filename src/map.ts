import './map.css'
import { InteractiveMap } from './interactive-map.ts';
import { CountriesReportsSelect } from './countries-reports-select.ts';

window.addEventListener('DOMContentLoaded', async () => {
  const map: InteractiveMap = new InteractiveMap(document.getElementById('js-interactive-map') as HTMLElement);
  await map.init();

  const countriesReportsSelect: CountriesReportsSelect = new CountriesReportsSelect('js-countries-reports');
  await countriesReportsSelect.init();
});
