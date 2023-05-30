import { transformJsonSchemaValidationErrors } from '@axinom/mosaic-service-common';
import {
  SnapshotValidationIssueContextEnum,
  SnapshotValidationIssueSeverityEnum,
} from 'zapatos/custom';
import { SnapshotValidationResult } from '../models';
import {
  getAjv,
  SnapshotAggregationResults,
  SnapshotDataValidator,
} from './publishing-common';

export const commonPublishValidator: SnapshotDataValidator = async (
  data: SnapshotAggregationResults,
  jsonSchema?: Record<string, unknown>,
  customValidation?: (json: unknown) => Promise<SnapshotValidationResult[]>,
) => {
  let jsonSchemaResults: SnapshotValidationResult[] = [];
  if (jsonSchema) {
    const ajv = getAjv();
    const validate = ajv.compile(jsonSchema);
    validate(data.result);

    jsonSchemaResults = transformJsonSchemaValidationErrors<
      SnapshotValidationIssueSeverityEnum,
      SnapshotValidationIssueContextEnum
    >(validate.errors);
  }

  const customResults = (await customValidation?.(data.result)) ?? [];

  return [...data.validation, ...customResults, ...jsonSchemaResults];
};
