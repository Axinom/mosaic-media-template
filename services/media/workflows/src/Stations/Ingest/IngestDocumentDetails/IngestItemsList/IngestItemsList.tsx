import { Accordion, AccordionItem } from '@axinom/mosaic-ui';
import React, { ReactNode } from 'react';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import {
  IngestDocumentQuery,
  IngestEntityExistsStatus,
  IngestItemStatus,
} from '../../../../generated/graphql';
import classes from './IngestItemsList.module.scss';

type IngestItems = NonNullable<
  IngestDocumentQuery['ingestDocument']
>['ingestItems']['nodes'];

interface IngestItemsListProps {
  items: IngestItems;
}

export const IngestItemsList: React.FC<IngestItemsListProps> = ({ items }) => {
  // TODO: Subscription to update the ingest items details goes here

  return (
    <Accordion alignAccordionItem={false}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          header={
            <div className={classes.header}>
              {getStatusIcon(item.status)}
              <div className={classes.externalID}>
                External ID: {item.externalId},
              </div>
              <div>{item.displayTitle}</div>
              <div className={classes.status}>
                {item.type} {getExistStatusText(item.existsStatus)}
              </div>
            </div>
          }
        >
          <IngestItemSteps item={item} />
        </AccordionItem>
      ))}
    </Accordion>
  );
};

function getStatusIcon(status: IngestItemStatus): ReactNode {
  switch (status) {
    case IngestItemStatus.Success:
      return <StatusIcons icon={StatusIcon.Success} className={classes.icon} />;

    case IngestItemStatus.Error:
      return <StatusIcons icon={StatusIcon.Error} className={classes.icon} />;

    case IngestItemStatus.InProgress:
      return (
        <StatusIcons icon={StatusIcon.Progress} className={classes.icon} />
      );
  }
}

function getExistStatusText(status: IngestEntityExistsStatus): string {
  switch (status) {
    case IngestEntityExistsStatus.Created:
      return 'Creation';
    case IngestEntityExistsStatus.Error:
      return 'Error';
    case IngestEntityExistsStatus.Existed:
      return 'Update';
  }
}

interface IngestItemStepsProps {
  item: IngestItems[number];
}

const IngestItemSteps: React.FC<IngestItemStepsProps> = ({ item }) => {
  // TODO: Subscription to update ingest item steps goes here

  const sorted = [...item.ingestItemSteps.nodes].sort(
    (a, b) =>
      a.type.localeCompare(b.type) || a.subType.localeCompare(b.subType),
  );

  return (
    <div className={classes.rowWrapper}>
      {sorted.map((step) => (
        <div key={step.id} className={classes.row}>
          <div></div>
          <div>{step.type}</div>
          <div>{step.subType}</div>
          <div>{step.status}</div>
          <div>{step.responseMessage}</div>
        </div>
      ))}
    </div>
  );
};
