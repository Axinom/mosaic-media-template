import {
  ActionHandler,
  Create,
  CreateProps,
  createUpdateGQLFragmentGenerator,
  DateTimeTextField,
  generateArrayMutations,
  getFormDiff,
  StationMessage,
  TagsField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { validate as isUuid } from 'uuid';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateTvshowsLicenseMutation,
  IsoAlphaTwoCountryCodes,
  MoviesLicensesCountryInput,
  Mutation,
  MutationCreateTvshowsLicenseArgs,
  MutationCreateTvshowsLicensesCountryArgs,
  useCreateTvshowsLicenseMutation,
  useGetAllCountryDataQuery,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationCreateTvshowsLicenseArgs['input']['tvshowsLicense'] & {
  countries?: string[];
};

type SubmitResponse = CreateTvshowsLicenseMutation['createTvshowsLicense'];
interface Option {
  display: string;
  value: any;
}

export const TvShowLicensingCreate: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );
  const [stationMessage, setStationMessage] = useState<StationMessage>();
  const licenseSchema = Yup.object()
    .shape<ObjectSchemaDefinition<FormData>>({
      tvshowId: Yup.number().required(),
      licenseStart: getLicenseStartSchema().label('From'),
      licenseEnd: getLicenseEndSchema().label('To'),
      countries: Yup.array(),
    })
    .test(
      'at-least-one-required',
      'At least one of the fields is required',
      (values) => {
        if (
          values.licenseStart ||
          values.licenseEnd ||
          (values.countries && values.countries.length > 0)
        ) {
          setStationMessage(undefined);
        } else {
          setStationMessage({
            type: 'error',
            title: `At least one field is required to create a new license.`,
          });
        }
        return (
          values.licenseStart ||
          values.licenseEnd ||
          (values.countries && values.countries.length > 0)
        );
      },
    );
  const [createTvshowLicenseMutation] = useCreateTvshowsLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const { data } = useGetAllCountryDataQuery({ client });

  const { allCountries } = useMemo(
    () => ({
      allCountries:
        data?.allCountryTypes?.nodes.map(({ name, id }) => ({
          display: name ?? '',
          value: id,
        })) ?? [],
    }),
    [data],
  );

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: CreateProps<FormData>['initialData'],
    ): Promise<SubmitResponse> => {
      const { countries, ...rest } = getFormDiff(formData, initialData.data);
      const result = await createTvshowLicenseMutation({
        variables: {
          input: {
            tvshowsLicense: {
              tvshowId: tvshowId,
              ...rest,
            },
          },
        },
      });
      if (
        result?.data?.createTvshowsLicense?.tvshowsLicense?.id &&
        countries &&
        countries.length > 0
      ) {
        const generateUpdateGQLFragment =
          createUpdateGQLFragmentGenerator<Mutation>();

        const licenseId = Number(
          result?.data?.createTvshowsLicense?.tvshowsLicense?.id,
        );

        const countryAssignmentMutations = generateArrayMutations({
          current: formData.countries,
          original: initialData.data?.countries,
          generateCreateMutation: (code) =>
            generateUpdateGQLFragment<MutationCreateTvshowsLicensesCountryArgs>(
              'createTvshowsLicensesCountry',
              {
                input: {
                  tvshowsLicensesCountry: generateCountryAssignmentPatch(
                    code,
                    licenseId,
                  ),
                },
              },
            ),
          generateDeleteMutation: function (): string {
            throw new Error('Function not implemented.');
          },
        });
        const GqlMutationDocument = gql`mutation UpdateTvShowsLicense {
          ${countryAssignmentMutations}
        }`;

        await client.mutate({ mutation: GqlMutationDocument });
      }
      return result?.data?.createTvshowsLicense;
    },
    [createTvshowLicenseMutation, tvshowId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.tvshowsLicense) {
        history.push(
          `/tvshows/${tvshowId}/licenses/${submitResponse.tvshowsLicense.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history, tvshowId],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New TV Show License"
      subtitle="Properties"
      onProceed={onProceed}
      validationSchema={licenseSchema}
      initialData={{
        loading: false,
        data: { tvshowId, countries: [] },
      }}
      saveData={onSubmit}
      cancelNavigationUrl={`/tvshows/${tvshowId}/licenses`}
      stationMessage={stationMessage}
    >
      <Form countryOptions={allCountries} />
    </Create>
  );
};

const Form: React.FC<{
  countryOptions?: Option[];
}> = ({ countryOptions }) => {
  return (
    <>
      <Field name="licenseStart" label="From" as={DateTimeTextField} />
      <Field name="licenseEnd" label="To" as={DateTimeTextField} />
      <Field
        name="countries"
        label="Licensing Countries"
        tagsOptions={countryOptions}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
    </>
  );
};

const generateCountryAssignmentPatch = (
  countryId: IsoAlphaTwoCountryCodes | string,
  tvshowsLicenseId: number,
): MoviesLicensesCountryInput['id'] => {
  if (!isUuid(countryId)) {
    return {
      tvshowsLicenseId,
      countryCode: { type: 'enum', value: countryId },
    };
  } else {
    return {
      tvshowsLicenseId,
      countryGroupId: countryId,
    };
  }
};
