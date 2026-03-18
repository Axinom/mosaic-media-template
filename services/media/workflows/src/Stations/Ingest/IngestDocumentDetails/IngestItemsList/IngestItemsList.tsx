import { Accordion, AccordionItem, Tags } from '@axinom/mosaic-ui';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
import { StepActionButton } from './StepActionButton/StepActionButton';

type IngestItems = NonNullable<
  IngestDocumentQuery['ingestDocument']
>['ingestItems']['nodes'];

interface IngestItemsListProps {
  items: IngestItems;
}

const StatusLabels = {
  [IngestItemStatus.Success]: 'Success',
  [IngestItemStatus.Error]: 'Error',
  [IngestItemStatus.InProgress]: 'In Progress',
};

export const IngestItemsList: React.FC<IngestItemsListProps> = ({ items }) => {
  const [filterOptions, setFilterOptions] = useState<
    { label: string; value: IngestItemStatus }[]
  >([]);

  const [filter, setFilter] = useState<IngestItemStatus[]>([]);
  const filterTouched = useRef(false);

  useEffect(() => {
    const statuses = new Set<IngestItemStatus>();
    items.forEach((item) => statuses.add(item.status));
    setFilterOptions([
      ...[...statuses].map((s) => {
        return {
          label: StatusLabels[s] ?? s,
          value: s,
        };
      }),
    ]);

    if (!filterTouched.current && statuses.size > 0) {
      // re-initialize filter if it was not touched
      setFilter([...statuses]);
    } else if (statuses.size > 0) {
      setFilter((prev) => {
        const selected = prev.filter((f) => statuses.has(f));
        if (selected.length > 0) {
          // keep the selected filters if they are still available
          return selected;
        } else {
          // otherwise return all statuses
          return [...statuses];
        }
      });
    }
  }, [items]);

  // TODO: Subscription to update the ingest items details goes here

  return (
    <>
      {filterOptions.length > 1 && (
        <Tags
          name="status"
          inlineMode={true}
          tagsOptions={filterOptions}
          value={filter}
          onChange={(value) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setFilter(value.currentTarget.value as any);
            filterTouched.current = true;
          }}
          displayKey="label"
          valueKey="value"
          dropDownLabel="Add filter"
        />
      )}
      <Accordion alignAccordionItem={false}>
        {items.map((item) =>
          filter.indexOf(item.status) !== -1 ? (
            <AccordionItem
              key={item.id}
              header={
                <div className={classes.header}>
                  {getStatusIcon(item.status)}
                  <div
                    data-test-id="entity-external-id"
                    className={classes.externalID}
                  >
                    External ID: {item.externalId},
                  </div>
                  <div>{item.displayTitle}</div>
                  <div
                    data-test-id="entity-operation"
                    className={classes.status}
                  >
                    {item.type} {getExistStatusText(item.existsStatus)}
                  </div>
                </div>
              }
            >
              <IngestItemSteps item={item} />
            </AccordionItem>
          ) : null,
        )}
      </Accordion>
    </>
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
    <div data-test-id="ingestion-item-list" className={classes.rowWrapper}>
      {sorted.map((step) => (
        <div
          data-test-id="ingestion-single-item"
          key={step.id}
          className={classes.row}
        >
          <div></div>
          <div data-test-id="ingestion-type">{step.type}</div>
          <div data-test-id="ingestion-subtype">{step.subType}</div>
          <div data-test-id="ingestion-status">{step.status}</div>
          <div data-test-id="ingestion-response-message">
            {step.responseMessage}
          </div>
          <div data-test-id="ingestion-step-action-btn">
            <StepActionButton
              stepType={step.type}
              itemType={item.type}
              stepEntityId={step.entityId ?? undefined}
              itemEntityId={item.entityId}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
