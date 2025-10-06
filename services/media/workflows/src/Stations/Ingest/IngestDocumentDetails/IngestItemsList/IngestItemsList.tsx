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
import {
  IngestDocumentQuery,
  IngestEntityExistsStatus,
  IngestItemStatus,
  IngestItemStepType,
  IngestItemType,
} from '../../../../generated/graphql';
import { fillPathTemplate } from '../../../../Util/PathUtils';
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
              entityId={step.entityId ?? undefined}
              itemEntityId={item.entityId}
              className={classes.actionButton}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Generalized path templates
type PathTemplateKey =
  | `${IngestItemType}_${IngestItemStepType}`
  | IngestItemType
  | IngestItemStepType;

const PATH_TEMPLATES: Partial<Record<PathTemplateKey, string>> = {
  // Special cases for localizations
  MOVIE_LOCALIZATIONS: '/movies/:itemEntityId/localization',
  EPISODE_LOCALIZATIONS: '/episodes/:itemEntityId/localization',
  SEASON_LOCALIZATIONS: '/seasons/:itemEntityId/localization',
  TVSHOW_LOCALIZATIONS: '/tvshows/:itemEntityId/localization',

  // Default entity paths
  MOVIE: '/movies/:itemEntityId',
  EPISODE: '/episodes/:itemEntityId',
  SEASON: '/seasons/:itemEntityId',
  TVSHOW: '/tvshows/:itemEntityId',

  // Step type fallbacks
  IMAGE: '/images/:entityId',
  VIDEO: '/videos/:entityId',
};

function resolvePathTemplate(
  itemType: IngestItemType,
  stepType: IngestItemStepType,
  params: {
    itemEntityId: string | number;
    entityId?: string | number;
    type: string;
  },
): string | undefined {
  // Try most specific key first
  const specificKey = `${itemType}_${stepType}` as PathTemplateKey;
  let template = PATH_TEMPLATES[specificKey];

  // Fallback to itemType or stepType
  if (!template) {
    template =
      stepType === IngestItemStepType.Entity
        ? PATH_TEMPLATES[itemType]
        : PATH_TEMPLATES[stepType];
  }

  return template ? fillPathTemplate(template, params) : undefined;
}

interface StepActionButtonProps {
  stepType: IngestItemStepType;
  itemType: IngestItemType;
  entityId: string | number | undefined;
  itemEntityId: string | number;
  className?: string;
}

const StepActionButton: React.FC<StepActionButtonProps> = ({
  stepType,
  itemType,
  entityId,
  itemEntityId,
  className,
}) => {
  const path = resolvePathTemplate(itemType, stepType, {
    itemEntityId,
    entityId,
    type: itemType.toLowerCase(),
  });

  // If path is not resolved or still contains a placeholder, do not render the button
  if (!path || /:([a-zA-Z0-9_]+)/.test(path)) {
    return <></>;
  }

  return (
    <Button className={className} icon={IconName.NavigateRight} path={path} />
  );
};
