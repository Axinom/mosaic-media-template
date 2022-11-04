--! Previous: sha1:084e6e12307df75083114a3269ba237e64931af6
--! Hash: sha1:0f9e40a4ab281e71311cefb5d8603fc0317524dd
--! Message: monetization-integrated

SELECT ax_define.create_messaging_counter_table();

DROP TABLE IF EXISTS app_hidden.claim_sets CASCADE;
CREATE TABLE app_hidden.claim_sets (
  key TEXT NOT NULL PRIMARY key,
  title TEXT NOT NULL,
  description TEXT,
  claims TEXT[] NOT NULL DEFAULT '{}'::TEXT[]
);
SELECT ax_define.define_audit_date_fields_on_table('claim_sets', 'app_hidden');
SELECT ax_define.define_audit_user_fields_on_table('claim_sets', 'app_hidden', ':DEFAULT_USERNAME');

DROP TABLE IF EXISTS app_hidden.subscription_plans CASCADE;
CREATE TABLE app_hidden.subscription_plans (
  id UUID NOT NULL PRIMARY key,
  title TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  claim_set_keys TEXT[] NOT NULL DEFAULT '{}'::TEXT[]
);
SELECT ax_define.define_audit_date_fields_on_table('subscription_plans', 'app_hidden');
SELECT ax_define.define_audit_user_fields_on_table('subscription_plans', 'app_hidden', ':DEFAULT_USERNAME');

SELECT ax_define.define_index('is_enabled', 'subscription_plans', 'app_hidden');
SELECT ax_define.define_index('claim_set_keys', 'subscription_plans', 'app_hidden');
