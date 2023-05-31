import { Create, Select, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React from 'react';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateCustomerInput,
  CreateCustomerMutation,
  useCreateCustomerMutation,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';

type CustomerData = Pick<
  CreateCustomerInput,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'mobile'
  | 'password'
  | 'registration_country'
>;

type SubmitResponse = CreateCustomerMutation['createCustomer'];

const customerCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<CustomerData>
>({
  password: Yup.string().required('Password is a required field'),
  last_name: Yup.string().required('Last Name is a required field'),
});

export const CustomerCreate: React.FC = () => {
  const history = useHistory();
  const [createCustomer] = useCreateCustomerMutation({
    client,
    fetchPolicy: 'network-only',
  });

  const saveData = async (values: CustomerData): Promise<SubmitResponse> => {
    return (
      await createCustomer({
        variables: {
          input: {
            email: values.email,
            mobile: values.mobile,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
            registration_country: values.registration_country,
          },
        },
      })
    ).data?.createCustomer;
  };

  return (
    <Create<CustomerData, SubmitResponse>
      initialData={{ loading: false }}
      saveData={saveData}
      title={'New Customer'}
      validationSchema={customerCreateSchema}
      subtitle="Register a new customer"
      onProceed={({ submitResponse }) => {
        if (submitResponse) {
          history.push('/customers/');
        }
      }}
    >
      <Form />
    </Create>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="first_name" label="First Name" as={SingleLineTextField} />
      <Field
        name="last_name"
        label="Last Name"
        as={SingleLineTextField}
        required
      />
      <Field name="email" label="Email" as={SingleLineTextField} />
      <Field name="mobile" label="Mobile" as={SingleLineTextField} />
      <Field
        name="password"
        label="Password"
        as={SingleLineTextField}
        required
      />
      <Field
        name="registration_country"
        label="Registration Country"
        as={Select}
        options={CountryNames}
      />
    </>
  );
};
