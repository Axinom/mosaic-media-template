import {
  Details,
  InitialFormData,
  ReadOnlyField,
  Select,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  Customer,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import { GenderOptions } from '../../../Util/GenderOptions/GenderOptions';
import { useCustomerDetailsActions } from './CustomerDetails.actions';

type CustomerData = Pick<
  Customer,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'gender'
  | 'registration_country'
>;

const customerUpdateSchema = Yup.object().shape<
  ObjectSchemaDefinition<CustomerData>
>({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is a required field'),
  id: Yup.string().required('Id is a required field'),
});

export const CustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { data, loading, error } = useGetCustomerByIdQuery({
    client,
    variables: {
      customerId: customerId,
    },
    fetchPolicy: 'network-only',
  });

  const [updateMutation] = useUpdateCustomerMutation({
    client,
    fetchPolicy: 'network-only',
  });

  const { actions } = useCustomerDetailsActions(customerId);

  return (
    <Details<CustomerData>
      titleProperty={'id'}
      subtitle="Properties"
      initialData={{ loading, error, data: data?.getCustomer }}
      validationSchema={customerUpdateSchema}
      saveData={function (
        values: CustomerData,
        initialData: InitialFormData<CustomerData>,
      ): void | Promise<unknown> {
        return updateMutation({
          variables: {
            input: {
              id: values.id,
              first_name: values.first_name,
              last_name: values.last_name,
              gender: values.gender,
              email: values.email,
              registration_country: values.registration_country,
            },
          },
        });
      }}
      actions={actions}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="id" label="Id" as={ReadOnlyField} />
      <Field name="first_name" label="First Name" as={SingleLineTextField} />
      <Field name="last_name" label="Last Name" as={SingleLineTextField} />
      <Field name="gender" label="Gender" as={Select} options={GenderOptions} />
      <Field name="email" label="Email" as={SingleLineTextField} />
      <Field
        name="registration_country"
        label="Registration Country"
        as={Select}
        options={CountryNames}
      />
    </>
  );
};
