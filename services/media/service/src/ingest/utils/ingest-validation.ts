import {
  group,
  groupBy,
  isEmptyObject,
  isNullOrWhitespace,
  MosaicError,
} from '@axinom/mosaic-service-common';
import {
  ImageIngestData,
  IngestDocument,
  LicenseData,
  VideoIngestData,
} from 'media-messages';
import { IValidationError } from '../../common';

export const customIngestValidation = (
  document: IngestDocument,
): IValidationError[] => {
  //Make sure that external_id is unique per item type
  const duplicateExternalIdErrors: IValidationError[] = Object.values(
    groupBy(document.items, ['type', 'external_id']),
  )
    .filter((group) => group.length > 1)
    .map((group) => ({
      message: `Document has ${group.length} duplicate items with type "${group[0].type}" and external_id "${group[0].external_id}"`,
      type: 'CustomDataValidation',
    }));

  //Check that main video and trailer sources are unique in context of each item
  const itemVideos = document.items
    .filter(
      (item) =>
        item.data?.trailers ||
        (item.data?.main_video && !isEmptyObject(item.data.main_video)),
    )
    .map((item) => ({
      external_id: item.external_id,
      videos: [
        ...((item.data.trailers as VideoIngestData[]) ?? []),
        item.data.main_video as VideoIngestData,
      ],
    }));

  const duplicateVideoErrors: IValidationError[] = [];
  for (const itemInfo of itemVideos) {
    const errors: IValidationError[] = Object.values(
      groupBy(
        itemInfo.videos.filter((video) => !isNullOrWhitespace(video?.source)),
        'source',
      ),
    )
      .filter((group) => group.length > 1)
      .map((group) => ({
        message: `Item with externalId "${itemInfo.external_id}" is using a video with source "${group[0].source}" more than once.`,
        type: 'CustomDataValidation',
      }));

    duplicateVideoErrors.push(...errors);
  }

  //Check that licenses are unique in context of each item
  const itemLicenses = document.items
    .filter((item) => item.data?.licenses)
    .map((item) => ({
      external_id: item.external_id,
      licenses: (item.data.licenses as LicenseData[]).map((license) =>
        JSON.stringify({
          start: license.start,
          end: license.end,
          countries: license.countries?.sort(),
        }),
      ),
    }));

  const duplicateLicenseErrors: IValidationError[] = [];
  for (const itemInfo of itemLicenses) {
    const errors: IValidationError[] = Object.values(group(itemInfo.licenses))
      .filter((group) => group.length > 1)
      .map((group) => ({
        message: `Item with externalId "${itemInfo.external_id}" has ${group.length} duplicate licenses "${group[0]}".`,
        type: 'CustomDataValidation',
      }));

    duplicateLicenseErrors.push(...errors);
  }

  //Make sure that image types are not duplicated in context of one ingest item
  const duplicateImageErrors: IValidationError[] = [];
  for (const itemInfo of document.items) {
    if (itemInfo.data?.images === undefined) {
      continue;
    }

    const errors: IValidationError[] = Object.values(
      groupBy((itemInfo.data.images as ImageIngestData[]) ?? [], 'type'),
    )
      .filter((group) => group.length > 1)
      .map((group) => ({
        message: `Item with externalId "${itemInfo.external_id}" has ${group.length} images with duplicate type "${group[0].type}".`,
        type: 'CustomDataValidation',
      }));

    duplicateImageErrors.push(...errors);
  }

  return [
    ...duplicateExternalIdErrors,
    ...duplicateVideoErrors,
    ...duplicateLicenseErrors,
    ...duplicateImageErrors,
  ];
};

export const getIngestErrorMessage = (
  error: Error,
  defaultMessage: string,
): string => {
  if (error instanceof MosaicError) {
    return error.message;
  }

  return defaultMessage;
};
