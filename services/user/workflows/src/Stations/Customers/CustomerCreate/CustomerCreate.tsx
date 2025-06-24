import {
  ActionHandler,
  Create,
  SelectField,
  showNotification,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { axiosInstance } from '../../../axios/axios';
import { Constants } from '../../../constants';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';

interface FormData {
  first_name: string;
  last_name: string;
  password: string;
  email?: string;
  mobile?: string;
  gender?: string;
  registration_country?: string;
}

interface SubmitResponse {
  data: { id: string };
}

const customerCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  first_name: Yup.string()
    .label(Constants.CustomerDetails.FormLabels.FirstName)
    .required(),
  last_name: Yup.string()
    .label(Constants.CustomerDetails.FormLabels.LastName)
    .required(),
  password: Yup.string()
    .label(Constants.CustomerCreate.FormLabels.Password)
    .required(),
  email: Yup.string().label(Constants.CustomerDetails.FormLabels.Email).email(),
});

export const CustomerCreate: React.FC = () => {
  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return axiosInstance.post('/v1/manage/customer', formData);
    },
    [],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse && submitResponse.data.id) {
        history.push(`/customers/${submitResponse.data.id}`);
      } else {
        showNotification({
          title: 'Customer created successfully',
          options: {
            type: 'success',
          },
        });
        history.push('/customers');
      }
    },
    [history],
  );

  const genderOptions = [
    { label: Constants.CustomerDetails.GenderLabels.Unknown, value: 'unknown' },
    { label: Constants.CustomerDetails.GenderLabels.Male, value: 'male' },
    { label: Constants.CustomerDetails.GenderLabels.Female, value: 'female' },
  ];

  return (
    <Create<FormData, SubmitResponse>
      title={Constants.CustomerCreate.FormTitles.New}
      subtitle={Constants.CustomerCreate.FormTitles.Subtitle}
      validationSchema={customerCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/customers"
      initialData={{
        loading: false,
      }}
    >
      <Field
        name="first_name"
        label={Constants.CustomerDetails.FormLabels.FirstName}
        as={SingleLineTextField}
      />
      <Field
        name="last_name"
        label={Constants.CustomerDetails.FormLabels.LastName}
        as={SingleLineTextField}
      />
      <Field
        name="password"
        label={Constants.CustomerCreate.FormLabels.Password}
        as={SingleLineTextField}
        type="password"
      />
      <Field
        name="gender"
        label={Constants.CustomerDetails.FormLabels.Gender}
        as={SelectField}
        options={genderOptions}
      />
      <Field
        name="email"
        label={Constants.CustomerDetails.FormLabels.Email}
        as={SingleLineTextField}
      />
      <Field
        name="mobile"
        label={Constants.CustomerDetails.FormLabels.Mobile}
        as={SingleLineTextField}
      />
      <Field
        name="registration_country"
        label={Constants.CustomerDetails.FormLabels.RegistrationCountry}
        as={SelectField}
        options={CountryNames}
        addEmptyOption={true}
        placeholder={Constants.CustomerDetails.Placeholders.SelectCountry}
      />
    </Create>
  );
};
