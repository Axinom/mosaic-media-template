import {
  Divider,
  formatDateTime,
  FormGroupTitle,
  GenericField,
  ReadOnlyField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import React from 'react';
import { client } from '../../../../apolloClient';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import {
  IngestDocumentQuery,
  useIngestDocumentQuery,
} from '../../../../generated/graphql';
import { IngestItemsList } from '../IngestItemsList/IngestItemsList';
import classes from './IngestStatus.module.scss';

type IngestDocument = NonNullable<IngestDocumentQuery['ingestDocument']>;

interface IngestStatusProps {
  initialData: IngestDocument;
}

export const IngestStatus: React.FC<IngestStatusProps> = ({ initialData }) => {
  // TODO: Subscription to update ingest document status goes here.

  const { data: queryData } = useIngestDocumentQuery({
    client,
    variables: { id: initialData.id },
    skip: !initialData.id,
    fetchPolicy: 'no-cache',
    pollInterval: 5000,
  });

  const data: IngestDocument = { ...initialData, ...queryData?.ingestDocument };

  return (
    <>
      <GenericField name="status" label="Ingest Status">
        <div className={classes.statusContainer}>
          <div className={classes.statusItem}>
            Processed: {data.successCount + data.errorCount}
          </div>
          <div className={classes.statusItem}>
            <StatusIcons icon={StatusIcon.Success} className={classes.icon} />
            <div>Success: {data.successCount}</div>
          </div>
          <div className={classes.statusItem}>
            <StatusIcons icon={StatusIcon.Error} className={classes.icon} />
            <div>Failed: {data.errorCount}</div>
          </div>
        </div>
      </GenericField>
      <Field
        name="createdDate"
        label="Started At"
        as={ReadOnlyField}
        transform={formatDateTime}
      />
      <Divider />
      <FormGroupTitle title="Ingest Items" />
      <IngestItemsList items={data?.ingestItems?.nodes ?? []} />
    </>
  );
};
