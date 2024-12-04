import { makePluginByCombiningPlugins } from 'graphile-utils';
import { SmartTagsPlugin } from './smart-tags-plugin';
import { CreateCountryGroupsCountry } from './update-country-group';

export const AllCountryPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  CreateCountryGroupsCountry,
);
