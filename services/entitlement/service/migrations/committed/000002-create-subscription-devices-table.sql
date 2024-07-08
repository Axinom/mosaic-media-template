--! Previous: sha1:b2e7302ea0833ec41715a6e068db7bac2c229acb
--! Hash: sha1:18d95d8864d0477af8c365fa18b22a2f94121184
--! Message: create-subscription-devices-table

-- Remove this comment line and write your migration here. Make sure to keep one empty line between 'Message' header and first migration line to properly name future migration file.


DROP TABLE IF EXISTS app_hidden.subscription_devices CASCADE;
CREATE TABLE app_hidden.subscription_devices (
  id UUID NOT NULL PRIMARY key,
  subscription_code TEXT NOT NULL,
  device_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE,
  manual_closed BOOLEAN NOT NULL DEFAULT FALSE
);
