import {
  Details,
  DetailsProps,
  formatDateTime,
  getFormDiff,
  InfoPanel,
  Paragraph,
  Section,
  SelectField,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Gravatar } from '../../../../Components/Gravatar/Gravatar';
import { axiosInstance } from '../../../axios/axios';
import { Constants } from '../../../constants';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useCustomerDetailsActions } from './CustomerDetails.actions';
import { CustomerDetails } from './CustomerDetails.types';

type CustomerDetailsFormData = Pick<
  CustomerDetails,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'gender'
  | 'mobile'
  | 'registration_country'
>;

interface CustomerDetailsFormProps {
  customerId: string;
}

const customerDetailSchema = Yup.object<
  ObjectSchemaDefinition<CustomerDetailsFormData>
>({
  first_name: Yup.string()
    .label(Constants.CustomerDetails.FormLabels.FirstName)
    .required(),
  last_name: Yup.string()
    .label(Constants.CustomerDetails.FormLabels.LastName)
    .required(),
  email: Yup.string().label(Constants.CustomerDetails.FormLabels.Email).email(),
  gender: Yup.string(),
  mobile: Yup.string(),
  registration_country: Yup.string().label(
    Constants.CustomerDetails.FormLabels.RegistrationCountry,
  ),
});

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerId,
}) => {
  const [data, setData] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { actions } = useCustomerDetailsActions(
    customerId,
    data?.email,
    data?.activated,
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/v1/manage/customer/${customerId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  const onSubmit = useCallback(
    async (
      formData: CustomerDetailsFormData,
      initialData: DetailsProps<CustomerDetailsFormData>['initialData'],
    ): Promise<void> => {
      const patch = createUpdateDto(formData, initialData.data);
      await axiosInstance.put(`/v1/manage/customer`, {
        ...patch,
        id: customerId,
      });
    },
    [customerId],
  );

  return (
    <Details<CustomerDetailsFormData>
      defaultTitle={Constants.CustomerDetails.FormTitles.Default}
      titleProperty="email"
      subtitle={Constants.CustomerDetails.FormTitles.Subtitle}
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={customerDetailSchema}
      initialData={{
        data,
        loading,
        error,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<CustomerDetails>();

  return (
    <InfoPanel>
      <Section>
        {values.email && <Gravatar email={values.email} size={240} />}
      </Section>
      <Section title={Constants.CustomerDetails.PanelLabels.Title}>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.ID}>
          {getEnumLabel(values.id)}
        </Paragraph>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.Created}>
          {formatDateTime(values.create_date)}
        </Paragraph>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.Activation}>
          {values.activation_date
            ? formatDateTime(values.activation_date)
            : Constants.CustomerDetails.NotActivatedText}
        </Paragraph>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.LastLoginTime}>
          {formatDateTime(values.last_login)}
        </Paragraph>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.LastUserAgent}>
          {formatDateTime(values.last_user_agent ?? '')}
        </Paragraph>
        <Paragraph title={Constants.CustomerDetails.PanelLabels.LastIPAddress}>
          {formatDateTime(values.last_ip_address ?? '')}
        </Paragraph>
      </Section>
    </InfoPanel>
  );
};

const genderOptions = [
  { label: Constants.CustomerDetails.GenderLabels.Unknown, value: 'unknown' },
  { label: Constants.CustomerDetails.GenderLabels.Male, value: 'male' },
  { label: Constants.CustomerDetails.GenderLabels.Female, value: 'female' },
];

const Form: React.FC = () => {
  return (
    <>
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
      {/* <Field
        name="preferred_language"
        label={Constants.CustomerDetails.FormLabels.PreferredLanguage}
        as={SingleLineTextField}
      /> */}
      <Field
        name="registration_country"
        label={Constants.CustomerDetails.FormLabels.RegistrationCountry}
        as={SelectField}
        options={CountryNames}
        addEmptyOption={true}
        placeholder={Constants.CustomerDetails.Placeholders.SelectCountry}
      />
    </>
  );
};

function createUpdateDto(
  currentValues: CustomerDetailsFormData,
  initialValues?: CustomerDetailsFormData | null,
): Partial<CustomerDetailsFormData> {
  const { ...rest } = getFormDiff(currentValues, initialValues);

  return rest;
}
