import { Plugin } from 'graphile-build';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import {
  PublishValidationContext,
  PublishValidationSeverity,
  PublishValidationStatus,
} from '../../publishing';

export const ValidationTypesPlugin: Plugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      enum PublishValidationSeverity {
        ${PublishValidationSeverity.toString()}
      }
      enum PublishValidationContext {
        ${PublishValidationContext.toString()}
      }
      enum PublishValidationStatus {
        ${PublishValidationStatus.toString()}
      }
      type PublishValidationMessage {
        severity: PublishValidationSeverity!
        context: PublishValidationContext!
        message: String!
      }
    `,
  };
});
