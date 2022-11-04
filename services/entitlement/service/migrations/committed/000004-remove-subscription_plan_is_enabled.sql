--! Previous: sha1:0f9e40a4ab281e71311cefb5d8603fc0317524dd
--! Hash: sha1:667812ccc05b4318a97691a8b17e52e6483672eb
--! Message: remove-subscription_plan_is_enabled

SELECT ax_define.drop_index('is_enabled', 'subscription_plans');
ALTER TABLE app_hidden.subscription_plans DROP COLUMN is_enabled;
