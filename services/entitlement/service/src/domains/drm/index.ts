// Used by the GraphQL `entitlement` query, the `/entitlement` webhook, the
// service startup and the setup script.
export type { CommunicationKey } from './communication-key-selection';
export type { DrmSettings } from './drm-settings-helpers';
export {
  getCommunicationKey,
  getDrmTenantUrl,
  getFairPlayCertificateUrl,
} from './drm-settings-helpers';
export {
  getDrmSettings,
  loadDrmSettings,
  preloadDrmSettings,
  resetDrmSettingsCache,
} from './drm-settings';
