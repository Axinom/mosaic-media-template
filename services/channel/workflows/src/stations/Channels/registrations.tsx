import { registerLocalizationEntryPoints } from '@axinom/mosaic-managed-workflow-integration';
import { PiletApi } from '@axinom/mosaic-portal';
import * as React from 'react';
import { setGetProviders } from '../../externals/getProviders';
import { Extensions, ExtensionsContext } from '../../externals/piralExtensions';
import {
  channelDetailsStationResolverRegistration,
  programDetailsStationResolverRegistration,
} from '../../externals/routeResolvers';
import { ChannelIconName, ChannelIcons } from '../../icons/ChannelIcons';
import { PortalContext } from '../../store/portal-contex';
import { ChannelStationNames } from '../../types';
import { ChannelCreate } from './ChannelCreate/ChannelCreate';
import { ChannelDetails } from './ChannelDetails/ChannelDetails';
import { ChannelDetailsCrumb } from './ChannelDetails/ChannelDetailsCrumb';
import { ChannelImageManagement } from './ChannelImageManagement/ChannelImageManagement';
import { ChannelPublishing } from './ChannelPublishing/ChannelPublishing';
import { Channels } from './ChannelsExplorer/Channels';
import { ChannelVideoManagement } from './ChannelVideoManagement/ChannelVideoManagement';
import { PlaylistCreate } from './PlaylistCreate/PlaylistCreate';
import {
  PlaylistDetails,
  PlaylistStartTimeCrumb,
} from './PlaylistDetails/PlaylistDetails';
import { PlaylistPublishing } from './PlaylistPublishing/PlaylistPublishing';
import { Playlists } from './PlaylistsExplorer/Playlists';
import {
  ProgramDetails,
  resolveProgramDetailsRoot,
} from './ProgramManagement/ProgramDetails/ProgramDetails';
import { ProgramManagement } from './ProgramManagement/ProgramManagement';
import { routes } from './routes';

export const permissions = {
  'channel-service': ['ADMIN', 'CHANNELS_EDIT', 'CHANNELS_VIEW'],
};

export function register(app: PiletApi, extensions: Extensions): void {
  setGetProviders(app);

  const channelNav = {
    path: routes.channels,
    label: 'Channels',
    icon: <ChannelIcons icon={ChannelIconName.Channels} />,
  };

  // Generate entry points to embedded localization stations
  registerLocalizationEntryPoints(
    [
      {
        root: routes.channelDetails,
        entityIdParam: 'channelId',
        entityType: 'channel',
      },
      {
        root: routes.programLocalizationRoot,
        resolveRoot: resolveProgramDetailsRoot,
        entityIdParam: 'programId',
        entityType: 'program',
      },
    ],
    app,
  );

  app.setRouteResolver(
    ChannelStationNames.ChannelDetails,
    channelDetailsStationResolverRegistration,
  );

  app.setRouteResolver(
    ChannelStationNames.ProgramDetails,
    programDetailsStationResolverRegistration,
  );

  app.registerTile(
    {
      ...channelNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...channelNav,
    categoryName: 'Workflows',
    name: 'channels',
  });

  app.registerPage(routes.channels, Channels, {
    breadcrumb: () => 'Channels',
    permissions,
  });

  app.registerPage(routes.channelCreate, ChannelCreate, {
    breadcrumb: () => 'New Channel',
    permissions,
  });

  app.registerPage(
    routes.channelDetails,
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <ChannelDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: ChannelDetailsCrumb,
      permissions,
    },
  );

  app.registerPage(routes.playlists, Playlists, {
    breadcrumb: () => 'Playlists',
    permissions,
  });

  app.registerPage(routes.playlistCreate, PlaylistCreate, {
    breadcrumb: () => 'New Playlist',
    permissions,
  });

  app.registerPage(routes.playlistDetails, PlaylistDetails, {
    breadcrumb: PlaylistStartTimeCrumb,
    permissions,
  });
  app.registerPage(routes.playlistPublishing, PlaylistPublishing, {
    breadcrumb: () => 'Publishing',
    permissions,
  });

  app.registerPage(routes.channelPublishing, ChannelPublishing, {
    breadcrumb: () => 'Publishing',
    permissions,
  });

  app.registerPage(
    routes.program,
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <PortalContext.Provider
          value={{
            resolveRoute: app.resolveRoute,
          }}
        >
          <ProgramManagement />
        </PortalContext.Provider>
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Program',
      permissions,
    },
  );

  app.registerPage(routes.programDetails, () => <ProgramDetails />, {
    breadcrumb: () => 'Program',
    permissions,
  });

  app.registerPage(
    routes.channelLogo,
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <ChannelImageManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Manage Logo Image',
      permissions,
    },
  );

  app.registerPage(
    routes.channelVideos,
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <ChannelVideoManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Manage Placeholder Video',
      permissions,
    },
  );
}
