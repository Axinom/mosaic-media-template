import { formatDateTime, GenericField, ReadOnlyField } from '@axinom/mosaic-ui';
import clsx from 'clsx';
import { Field } from 'formik';
import React, { useState } from 'react';
import { client } from '../../../../apolloClient';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import {
  IngestDocumentQuery,
  IngestItemStatus,
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
  const [statusFilter, setStatusFilter] = useState<
    IngestItemStatus | undefined
  >();

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
      <Field
        name="createdDate"
        label="Started At"
        as={ReadOnlyField}
        transform={formatDateTime}
      />
      <GenericField name="status" label="Ingest Status">
        <div className={classes.statusContainer}>
          <div
            className={clsx(classes.statusItem, {
              [classes.active]: statusFilter === undefined,
            })}
            onClick={() => setStatusFilter(undefined)}
          >
            <div>Processed: {data.successCount + data.errorCount}</div>
          </div>
          <div
            className={clsx(classes.statusItem, {
              [classes.active]: statusFilter === IngestItemStatus.Success,
            })}
            onClick={() => setStatusFilter(IngestItemStatus.Success)}
          >
            <StatusIcons icon={StatusIcon.Success} className={classes.icon} />
            <div>Success: {data.successCount}</div>
          </div>
          <div
            className={clsx(classes.statusItem, {
              [classes.active]: statusFilter === IngestItemStatus.Error,
            })}
            onClick={() => setStatusFilter(IngestItemStatus.Error)}
          >
            <StatusIcons icon={StatusIcon.Error} className={classes.icon} />
            <div>Failed: {data.errorCount}</div>
          </div>
        </div>
        <IngestItemsList
          items={
            data?.ingestItems?.nodes.filter(
              (i) => statusFilter === undefined || i.status === statusFilter,
            ) ?? []
          }
        />
      </GenericField>
    </>
  );
};
