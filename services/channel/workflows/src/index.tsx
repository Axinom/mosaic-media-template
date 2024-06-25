import { PiletApi } from '@axinom/mosaic-portal';
import { initializeUi } from '@axinom/mosaic-ui';
import { initializeApolloClient } from './apolloClient/apolloClient';
import { bindExtensions } from './externals/piralExtensions';
import { initializeConfig, piletConfig } from './piletConfig';
import { register as registerChannels } from './stations/Channels/registrations';

export function setup(app: PiletApi): void {
  initializeConfig(app.meta.custom);

  // Provide the PiletAPI to the UI components (e.g. for raising toast notifications)
  initializeUi(app);

  initializeApolloClient(
    app.getToken,
    piletConfig.channelManagementHost,
    piletConfig.channelManagementHttpProtocol,
  );

  // Making all required extensions available
  const extensions = bindExtensions(app);

  // Registering all stations
  registerChannels(app, extensions);
}
