import { Button, IconName } from '@axinom/mosaic-ui';
import React from 'react';
import { usePortal } from '../../../../../context/portalContext';
import {
  IngestItemStepType,
  IngestItemType,
} from '../../../../../generated/graphql';

interface StepActionButtonProps {
  stepType: IngestItemStepType;
  itemType: IngestItemType;
  stepEntityId: string | undefined;
  itemEntityId: string | number;
}

export const StepActionButton: React.FC<StepActionButtonProps> = ({
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
