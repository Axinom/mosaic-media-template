import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import * as countries from 'i18n-iso-countries';
import { deletes, insert, selectOne } from 'zapatos/db';
import { getValidatedExtendedContext } from '../../../graphql';

async function createCountryGroupsCountry(
  _query: any,
  args: Record<string, any>,
  context: any,
  resolveInfo: any,
): Promise<Record<string, unknown>> {
  const { pgClient } = getValidatedExtendedContext(context);
  const { pgSql: sql } = resolveInfo.graphile.build;
  const { groupId, countryId } = args.input;
  const payload = {
    group_id: groupId,
    country_id: countryId,
  };
  let infoMessage = '';

  const countryGroupsCountry = await selectOne('country_groups_countries', {
    country_id: countryId,
  }).run(pgClient);

  if (countryGroupsCountry !== undefined) {
    const countryGroup = await selectOne('country_groups', {
      id: countryGroupsCountry?.group_id,
    }).run(pgClient);

    infoMessage = `${countries.getName(countryId, 'en')} was removed from the ${
      countryGroup?.name
    } group because the country can only be added to one country group.`;

    await deletes('country_groups_countries', {
      country_id: countryId,
    }).run(pgClient);
  }

  await insert('country_groups_countries', payload).run(pgClient);

  const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
    sql.fragment`app_public.country_groups_countries`,
    (tableAlias: string, queryBuilder: any) => {
      queryBuilder.where(
        sql.fragment`${tableAlias}.group_id = ${sql.value(groupId)}`,
      );
    },
  );

  return { data: rows, message: infoMessage };
}

/**
 * This extender plugin add countries for groups.
 */
export const CreateCountryGroupsCountry = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input CreateCountryGroupsCountryInput {
        groupId: String!
        countryId: IsoAlphaTwoCountryCodes!
      }

      type CreateCountryGroupsCountryPayload {
        message: String
        countryGroupsCountries: [CountryGroupsCountry] @pgField
      }
      extend type Mutation {
        """
        Adds a custom mutation to add countries for countries groups.
        """
        createCountryGroupsCountry(
          input: CreateCountryGroupsCountryInput!
        ): CreateCountryGroupsCountryPayload
      }
    `,
    resolvers: {
      Mutation: {
        createCountryGroupsCountry,
      },
    },
  };
});
