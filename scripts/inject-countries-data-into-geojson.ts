import { ICountryDataEntry, IGeoJsonData, IGeoJsonDataFeature } from '../src/models/models';
import { loadFile, writeJson } from '../src/helpers/json';

export async function injectCountriesDataIntoGeoJson (countriesData: ICountryDataEntry[]): Promise<void> {
  const africaGeoJsonData: IGeoJsonData = await loadFile<IGeoJsonData>('./data/africa.geojson');

  africaGeoJsonData.features.forEach((feature: IGeoJsonDataFeature) => {
    // @ts-ignore
    const country: ICountryDataEntry =
      countriesData.find(country => country.code === feature.properties.code);
    feature.properties.score = null;
  });

  await writeJson('africaWithScore.geojson', africaGeoJsonData);
}
