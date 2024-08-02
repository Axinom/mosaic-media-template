import { DynamicDataListControl, formatTitleCase } from '@axinom/mosaic-ui';
import { useFormikContext } from 'formik';
import React from 'react';
import { PublishValidationMessage } from '../../generated/graphql';
import { SeverityRenderer } from './SeverityRenderer/SeverityRenderer';

type ValidationValidationSeverity = 'WARNING' | 'ERROR' | 'SUCCESS';
type ValidationValidationContext =
  | 'METADATA'
  | 'IMAGES'
  | 'VIDEOS'
  | 'LOCALIZATION'
  | 'ALL';

interface ExtendedPublishValidationMessage
  extends Omit<PublishValidationMessage, 'severity' | 'context'> {
  severity: ValidationValidationSeverity;
  context: ValidationValidationContext;
}

const mapValidationValidations = (
  originalValidations?: PublishValidationMessage[],
): ExtendedPublishValidationMessage[] => {
  return !originalValidations
    ? [
        {
          context: 'ALL',
          severity: 'ERROR',
          message: 'Unhandled error occurred during validation',
        },
      ]
    : originalValidations.length === 0
    ? [
        {
          context: 'ALL',
          severity: 'SUCCESS',
          message: 'Validation Success for all categories',
        },
      ]
    : originalValidations;
};

export const ValidationResultsTable: React.FC = () => {
  const { values } = useFormikContext<{
    validationMessages: PublishValidationMessage[] | undefined;
  }>();
  return (
    <DynamicDataListControl<ExtendedPublishValidationMessage>
      name="validationDetails"
      label="Validation Details"
      value={mapValidationValidations(values?.validationMessages)}
      allowReordering={false}
      allowNewData={false}
      textWrap={true}
      columns={[
        {
          propertyName: 'context',
          label: 'Category',
          size: '0.5fr',
          render: (value) => {
            return formatTitleCase(value as string);
          },
        },
        {
          propertyName: 'severity',
          label: 'Validation Result',
          size: '0.7fr',
          render: SeverityRenderer,
        },
        { propertyName: 'message', label: 'Message', size: '5fr' },
      ]}
      stickyHeader={false}
    />
  );
};
