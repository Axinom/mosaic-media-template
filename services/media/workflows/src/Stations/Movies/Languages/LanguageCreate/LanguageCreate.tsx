import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { ActionHandler, Create, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../../apolloClient';
import {
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  useCreateLanguageMutation,
} from '../../../../generated/graphql';

type FormData = CreateLanguageMutationVariables['input']['language'];

type SubmitResponse = CreateLanguageMutation['createLanguage'];

const languageDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  code: Yup.string().required('Code is a required field').max(2),
});

export const LanguageCreate: React.FC = () => {
  const [languageCreate] = useCreateLanguageMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await languageCreate({
          variables: {
            input: {
              language: {
                title: formData.title,
                code: formData.code,
                native: formData?.native,
              },
            },
          },
        })
      ).data?.createLanguage;
    },
    [languageCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.language) {
        history.push(`/languages/${submitResponse?.language.id}`);
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Language"
      subtitle="Add new language metadata"
      validationSchema={languageDetailSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/languages"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="native" label="Native" as={SingleLineTextField} />
      <Field name="code" label="Code" as={SingleLineTextField} />
    </Create>
  );
};

export const LanguageCreateCrumb: BreadcrumbResolver = () => 'Create';
