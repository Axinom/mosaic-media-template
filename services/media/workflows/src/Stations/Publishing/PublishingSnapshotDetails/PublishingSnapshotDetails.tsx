import { Breadcrumb } from '@axinom/mosaic-portal';
import {
  FormActionData,
  formatDateTime,
  formatTitleCase,
  FormStation,
  GenericField,
  IconName,
  InfoPanel,
  List,
  MessageBar,
  Paragraph,
  ProgressBar,
  Section,
} from '@axinom/mosaic-ui';
import { useFormikContext } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  PublishingSnapshotQuery,
  PublishingSnapshotTitleDocument,
  PublishingSnapshotTitleQuery,
  SnapshotState,
  useDeleteSnapshotMutation,
  usePublishingSnapshotQuery,
  usePublishSnapshotMutation,
  useUnpublishSnapshotMutation,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import classes from './PublishingSnapshotDetails.module.scss';
import { SeverityRenderer } from './SeverityRenderer/SeverityRenderer';
import {
  mapValidationData,
  ValidationData,
} from './ValidationResultMapper/ValidationResultMapper';

type FormData = PublishingSnapshotQuery;

export interface PublishingSnapshotDetailsProps {
  snapshotId: number;
  type: EntityType;
}

export const PublishingSnapshotDetails: React.FC<
  PublishingSnapshotDetailsProps
> = ({ snapshotId, type }) => {
  const { loading, data, error, startPolling, stopPolling } =
    usePublishingSnapshotQuery({
      client,
      variables: { id: snapshotId },
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    if (
      data?.snapshot?.snapshotState === SnapshotState.Initialization ||
      data?.snapshot?.snapshotState === SnapshotState.Validation
    ) {
      startPolling(5000);
    }

    return () => {
      stopPolling();
    };
  }, [data?.snapshot?.snapshotState, startPolling, stopPolling]);

  const { actions } = useActions(snapshotId);

  return (
    <FormStation<FormData>
      defaultTitle="Snapshot Details"
      initialData={{
        loading,
        data: data?.snapshot?.entityType === type ? data : null,
        error: error?.message,
      }}
      actions={actions}
      saveData={() => {
        // We don't need to save the data, since this station only displays the snapshot status.
      }}
      infoPanel={<Panel />}
      edgeToEdgeContent={true}
    >
      {data?.snapshot?.snapshotState === SnapshotState.Invalid && (
        <MessageBar
          type="info"
          title="Snapshot cannot be published. Please check validation errors and fix related data accordingly."
        />
      )}
      <div className={classes.content}>
        <Form />
      </div>
    </FormStation>
  );
};

const Form: React.FC = () => {
  const { values } = useFormikContext<FormData>();

  if (
    values.snapshot?.snapshotState === SnapshotState.Initialization ||
    values.snapshot?.snapshotState === SnapshotState.Validation
  ) {
    return (
      <GenericField name="loading" label="Validation Details">
        <ProgressBar kind="full" indeterminate={true} />
      </GenericField>
    );
  }

  return (
    <GenericField label={'Validation Details'} name="snapshotValidationResults">
      <List<ValidationData>
        columns={[
          {
            propertyName: 'context',
            label: 'Category',
            size: '2fr',
            render: (value) => {
              return formatTitleCase(value as string);
            },
          },
          {
            propertyName: 'severity',
            label: 'Validation Result',
            size: '2.5fr',
            render: SeverityRenderer,
          },
          { propertyName: 'message', label: 'Message', size: '5fr' },
        ]}
        data={mapValidationData(
          values.snapshot?.snapshotValidationResults.nodes ?? [],
          values.snapshot?.snapshotState ?? SnapshotState.Error,
        )}
        showActionButton={false}
      />
    </GenericField>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<FormData>();
  return useMemo(() => {
    const fileBlob = new Blob(
      [JSON.stringify(values.snapshot?.snapshotJson, undefined, 2)],
      {
        type: 'application/json',
      },
    );

    return (
      <InfoPanel>
        <Section>
          <Paragraph title="Snapshot Data">
            <a
              href={URL.createObjectURL(fileBlob)}
              target="_blank"
              rel="noreferrer"
              download="SnapshotData.json"
            >
              Download JSON
            </a>
          </Paragraph>
          <Paragraph title="Snapshot ID">{values.snapshot?.id}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.snapshot?.createdDate)} by{' '}
            {values.snapshot?.createdUser}
          </Paragraph>
          <Paragraph title="State">
            {getEnumLabel(values.snapshot?.snapshotState ?? '')}
          </Paragraph>
          <Paragraph title="Last State Changed">
            {formatDateTime(values.snapshot?.updatedDate)} by{' '}
            {values.snapshot?.createdUser}
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    values.snapshot?.createdDate,
    values.snapshot?.createdUser,
    values.snapshot?.id,
    values.snapshot?.snapshotJson,
    values.snapshot?.snapshotState,
    values.snapshot?.updatedDate,
  ]);
};

function useActions(snapshotId: number): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [publishSnapshotMutation] = usePublishSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishSnapshotMutation] = useUnpublishSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [deleteSnapshotMutation] = useDeleteSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const publishSnapshot = async (): Promise<void> => {
    await publishSnapshotMutation({ variables: { id: snapshotId } });
  };

  const unpublishSnapshot = async (): Promise<void> => {
    await unpublishSnapshotMutation({ variables: { id: snapshotId } });
  };

  const deleteSnapshot = async (): Promise<void> => {
    await deleteSnapshotMutation({
      variables: { input: { id: snapshotId } },
    });
    history.goBack();
  };

  const actions: FormActionData<FormData>[] = [
    {
      label: 'Publish',
      confirmationMode: 'Simple',
      onActionSelected: publishSnapshot,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: unpublishSnapshot,
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteSnapshot,
    },
  ];

  return { actions } as const;
}

type SnapshotDetailsBreadcrumbResolver = (
  entityType: EntityType,
  params: {
    [key: string]: string;
  },
  paramKey: string,
) => Breadcrumb['label'];

export const SnapshotDetailsCrumb: SnapshotDetailsBreadcrumbResolver = (
  entityType,
  params,
  paramKey,
) => {
  return async (): Promise<string | number> => {
    const response = await client.query<PublishingSnapshotTitleQuery>({
      query: PublishingSnapshotTitleDocument,
      variables: {
        id: Number(params[paramKey]),
      },
      errorPolicy: 'ignore',
    });
    return response.data.snapshot?.entityType === entityType
      ? String(response.data.snapshot.snapshotNo)
      : 'Snapshot Details';
  };
};
