import {
  DetailedValidationError,
  getJsonPropertyReadablePath,
} from '@axinom/mosaic-service-common';
import { humanize, singularize } from 'inflection';
import * as yup from 'yup';
import { OptionalObjectSchema } from 'yup/lib/object';
import {
  SnapshotValidationIssueContextEnum,
  SnapshotValidationIssueSeverityEnum,
} from 'zapatos/custom';
import { SnapshotValidationResult } from '../models';

export const getReadablePath = (path: string): string => {
  const dataPath = path
    .replace(/\[/g, '/')
    .replace(/\]/g, '')
    .replace(/\./g, '/');
  return getJsonPropertyReadablePath(dataPath);
};

type YupValidationError = DetailedValidationError<
  SnapshotValidationIssueSeverityEnum,
  SnapshotValidationIssueContextEnum
>;

/**
 * Produces a yup warning message in case checked field has no items.
 */
export const oneItemWarning = (params: {
  path: string;
}): YupValidationError => {
  const identifier = humanize(params.path, true);
  return {
    message: `No ${identifier} are assigned.`,
    severity: 'WARNING',
    context: 'METADATA',
  };
};

/**
 * Produces a yup error message in case checked field has no items and must have at least one.
 */
export const oneItemError = (params: { path: string }): YupValidationError => {
  const identifier = humanize(singularize(params.path), true);
  return {
    message: `At least one ${identifier} must be assigned.`,
    severity: 'ERROR',
    context: 'METADATA',
  };
};

/**
 * Produces a yup error message for required property
 */
export const isRequired = (params: { path: string }): string => {
  const identifier = getReadablePath(params.path);
  return `${identifier} is required.`;
};

/**
 * Produces a yup error message for invalid URL property
 */
export const isUrl = (params: { path: string }): string => {
  const identifier = getReadablePath(params.path);
  return `${identifier} must be a valid URL.`;
};

/**
 * Produces a yup error message for empty property.
 */
export const nonEmptyProperty = (params: { path: string }): string => {
  const identifier = getReadablePath(params.path);
  return `${identifier} must not be empty.`;
};

/**
 * Produces a yup error message for zero or negative number
 */
export const isPositiveNumber = (params: { path: string }): string => {
  const identifier = getReadablePath(params.path);
  return `${identifier} must be a positive number.`;
};

/**
 * yup validation rule to check that string array has at least one element.
 */
export const atLeastOneString = yup.array(yup.string()).min(1, oneItemError);

/**
 * yup validation rule to check that array of objects has at least one object with type `COVER`
 */
export const requiredCover = yup.array(yup.object()).test({
  name: 'required_cover',
  message: 'Cover image is not assigned.',
  test: (images) => !!images && images.some((image) => image.type === 'COVER'),
});

/**
 * yup validation rule to check that all videos to be published are valid.
 * @param supportedTypes - spread array of string types. If `MAIN` is included - videos array musth have a video with `MAIN` type assigned.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const videosValidation = (...supportedTypes: string[]): any => {
  const commonVideosValidation = yup.array(
    yup
      .object({
        duration: yup.number().positive(isPositiveNumber).required(isRequired),
        audio_languages: yup
          .array(yup.string())
          .required(isRequired)
          .min(1, nonEmptyProperty),
        subtitle_languages: yup.array(yup.string()).required(isRequired).min(0),
        caption_languages: yup.array(yup.string()).required(isRequired).min(0),
        dash_manifest: yup.string().url(isUrl),
        hls_manifest: yup.string().url(isUrl),
        type: yup.string(),
      })
      .test({
        name: 'at_least_one_manifest',
        message: (params) => {
          const identifier = getReadablePath(params.path);
          return `${identifier} must have either DASH Manifest or HLS Manifest defined. Most probably assigned video is still processing.`;
        },
        test: (value) => !!value.dash_manifest || !!value.hls_manifest,
      }),
  );

  if (supportedTypes.some((t) => t === 'MAIN')) {
    return commonVideosValidation.test({
      name: 'required_main_video',
      message: 'Main video is not assigned.',
      test: (videos) =>
        !!videos && videos.some((video) => video.type === 'MAIN'),
    });
  }
  return commonVideosValidation;
};

/**
 * yup validation rule to check that all licenses to be published are valid.
 * @param atLeastOneLicenseRequired - If true - yup will produce an error for empty array. If false - yup will produce a warning for empty array.
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const licensesValidation = (atLeastOneLicenseRequired: boolean): any => {
  return yup
    .array(
      yup
        .object({
          start_time: yup.date(),
          end_time: yup.date().when('start_time', {
            is: (start: unknown) => !!start,
            then: (end) =>
              end.min(yup.ref('start_time'), (params) => {
                const identifier = getReadablePath(params.path);
                return `${identifier} must be greater than start_time.`;
              }),
          }),
          countries: yup.array(yup.string()), // Values validation is done using DB FK Constraints
        })
        .test({
          name: 'license_props',
          message: (params) => {
            const identifier = getReadablePath(params.path);
            return `${identifier} must have either start_time, end_time, or at least one country defined.`;
          },
          test: (value) =>
            !!value.start_time ||
            !!value.end_time ||
            (!!value.countries && value.countries.length > 0),
        }),
    )
    .min(1, atLeastOneLicenseRequired ? oneItemError : oneItemWarning);
};

/**
 * Validates passed json object against passed yup validation schema, producing a validation results object with errors and warnings arrays.
 */
export const validateYupPublishSchema = async (
  json: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yupSchema: OptionalObjectSchema<any>,
): Promise<SnapshotValidationResult[]> => {
  let results: SnapshotValidationResult[] = [];
  await yupSchema
    .validate(json, { abortEarly: false })
    .catch((validation: yup.ValidationError) => {
      results = validation.errors.map(
        (value: string | YupValidationError): SnapshotValidationResult =>
          typeof value === 'string'
            ? {
                context: 'METADATA',
                message: value,
                severity: 'ERROR',
              }
            : value,
      );
    });

  return results;
};
