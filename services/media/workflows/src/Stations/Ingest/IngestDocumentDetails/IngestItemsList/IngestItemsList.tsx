import {
  Accordion,
  AccordionItem,
  Button,
  IconName,
  Tags,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import { usePortal } from '../../../../context/portalContext';
import {
  IngestDocumentQuery,
  IngestEntityExistsStatus,
  IngestItemStatus,
  IngestItemStepType,
  IngestItemType,
} from '../../../../generated/graphql';
import classes from './IngestItemsList.module.scss';

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
    <div className={classes.rowWrapper}>
      {sorted.map((step) => (
        <div key={step.id} className={classes.row}>
          <div></div>
          <div>{step.type}</div>
          <div>{step.subType}</div>
          <div>{step.status}</div>
          <div>{step.responseMessage}</div>
          <div>
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

interface StepActionButtonProps {
  stepType: IngestItemStepType;
  itemType: IngestItemType;
  stepEntityId: string | undefined;
  itemEntityId: string | number;
}

const StepActionButton: React.FC<StepActionButtonProps> = ({
  stepType,
  stepEntityId,
  itemType,
  itemEntityId,
}) => {
  const { resolveRoute } = usePortal();

  let path: string | undefined;

  switch (stepType) {
    case IngestItemStepType.Entity:
      path = getStationRoute(`${itemType}-details`, stepEntityId, resolveRoute);
      break;
    case IngestItemStepType.Localizations:
      path = getStationRoute(
        `${itemType}-${stepType}`,
        itemEntityId,
        resolveRoute,
      );
      break;
    case IngestItemStepType.Video:
    case IngestItemStepType.Image:
      path = getStationRoute(`${stepType}-details`, stepEntityId, resolveRoute);
      break;
    default:
      break;
  }

  if (!path) {
    return <></>;
  }

  return <Button icon={IconName.NavigateRight} path={path} />;
};

function getStationRoute(
  station: string,
  id: string | number | undefined,
  resolveRoute: (
    station: string,
    dynamicRouteSegment?: string,
  ) => string | undefined,
): string | undefined {
  if (!id) {
    return undefined;
  }
  return resolveRoute(station.toLowerCase(), id.toString());
}
