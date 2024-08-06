import { ID, Maybe } from '@axinom/mosaic-managed-workflow-integration';
import '@axinom/mosaic-portal';

interface FastProviderData {
  type: string;
  label: string;
  selectionComponent: React.FC<{
    onClose: () => void;
    onSelected: (items: ProgramEntity[]) => void;
  }>;
  detailsResolver?: (params: {
    entityId: string;
    entityType: string;
  }) => string;
}

type FastProviderType = 'fast-provider';

interface ProgramEntity {
  title: string;
  videoId: ID;
  entityId: string;
  imageId?: Maybe<ID>;
}
declare module '@axinom/mosaic-portal' {
  /**
   * Route resolver registration function.
   */
  interface RegistrationFunction {
    (
      station: string,
      resolver: (
        dynamicRouteSegments?: Record<string, string> | string,
      ) => void,
    ): string | undefined;
  }

  interface ProviderRegistration {
    (type: FastProviderType, data: FastProviderData): void;
  }
  interface GetProviders {
    (type: FastProviderType): FastProviderData[];
  }
}
