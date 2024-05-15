import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { ProgramPatch } from '../../../../generated/graphql';
import { routes } from '../../routes';

export function useActions(
  programId: string,
  playlistId: string,
  channelId: string,
): {
  readonly actions: FormActionData<ProgramPatch>[];
} {
  const translationPath = getLocalizationEntryPoint('program');

  const actions: FormActionData<ProgramPatch>[] = [
    ...(translationPath
      ? [
          {
            label: 'Localizations',
            path: routes.generate(translationPath, {
              channelId,
              playlistId,
              programId,
            }),
          },
        ]
      : []),
  ];
  return { actions } as const;
}
